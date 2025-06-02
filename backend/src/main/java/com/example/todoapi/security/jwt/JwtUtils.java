package com.example.todoapi.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * JWT (JSON Web Token) の生成、検証、および関連するユーティリティ機能を提供するクラスです。
 * Springのコンポーネントとして登録され、DI (Dependency Injection) によって利用可能になります。
 */
@Component
public class JwtUtils {
    // このクラス専用のロガーを初期化します。ログ出力に使用されます。
    private static final Logger LOGGER = LoggerFactory.getLogger(JwtUtils.class);

    // JWTの署名に使用する秘密鍵です。
    // application.properties (または application.yml) の `todoapp.jwt.secret` プロパティから値が注入されます。
    @Value("${todoapp.jwt.secret}")
    private String jwtSecret;

    // JWTの有効期限（ミリ秒単位）です。
    // application.properties (または application.yml) の `todoapp.jwt.expirationMs` プロパティから値が注入されます。
    @Value("${todoapp.jwt.expirationMs}")
    private int jwtExpirationMs;

    /**
     * 認証情報 (Authenticationオブジェクト) をもとにJWTを生成します。
     *
     * @param authentication ユーザーの認証情報を含むAuthenticationオブジェクト。
     * @return 生成されたJWT文字列。
     */
    public String generateJwtToken(Authentication authentication) {
        // AuthenticationオブジェクトからUserDetailsを取得します。UserDetailsはユーザーの詳細情報（ユーザー名、パスワード、権限など）を保持します。
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        // Jwtsビルダーを使用してJWTを構築します。
        return Jwts.builder()
                // JWTの主題 (subject) としてユーザー名を設定します。
                .subject(userPrincipal.getUsername())
                // JWTの発行日時 (issued at) を現在時刻に設定します。
                .issuedAt(new Date())
                // JWTの有効期限 (expiration) を設定します。現在時刻に `jwtExpirationMs` で指定された期間を加算した時刻です。
                .expiration(new Date(new Date().getTime() + jwtExpirationMs))
                // JWTの署名に使用するアルゴリズム (HS256) と秘密鍵を設定します。`key()` メソッドで取得した秘密鍵を使用します。
                .signWith(key(), SignatureAlgorithm.HS256)
                // JWTを文字列形式に変換 (compact) します。
                .compact();
    }

    /**
     * (オプション) ユーザー名から直接JWTを生成します。
     * 例えば、UserDetailsServiceImplなどでユーザー情報を取得した後に、このメソッドを使用してトークンを生成できます。
     *
     * @param username トークンを生成する対象のユーザー名。
     * @return 生成されたJWT文字列。
     */
    public String generateTokenFromUsername(String username) {
        // Jwtsビルダーを使用してJWTを構築します。
        return Jwts.builder()
                // JWTの主題 (subject) として指定されたユーザー名を設定します。
                .subject(username)
                // JWTの発行日時 (issued at) を現在時刻に設定します。
                .issuedAt(new Date())
                // JWTの有効期限 (expiration) を設定します。現在時刻に `jwtExpirationMs` で指定された期間を加算した時刻です。
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                // JWTの署名に使用するアルゴリズム (HS512) と秘密鍵を設定します。`key()` メソッドで取得した秘密鍵を使用します。
                // 注意: このメソッドではHS512アルゴリズムが使用されています。generateJwtTokenメソッドではHS256が使用されています。
                .signWith(key(), SignatureAlgorithm.HS512)
                // JWTを文字列形式に変換 (compact) します。
                .compact();
    }

    /**
     * `jwtSecret` プロパティから取得したBASE64エンコードされた秘密鍵文字列をデコードし、
     * HMAC SHAアルゴリズム用の `SecretKey` オブジェクトを生成します。
     * このメソッドはJWTの署名と検証に使用するキーを準備するために内部的に呼び出されます。
     *
     * @return HMAC SHAアルゴリズム用のSecretKeyオブジェクト。
     */
    private SecretKey key() {
        // jwtSecret (BASE64エンコードされた文字列) をバイト配列にデコードします。
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        // デコードされたバイト配列からHMAC SHAキーを生成します。
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * JWTトークン文字列を解析し、そこに含まれるユーザー名 (subject) を取得します。
     * トークンの検証もこの処理の中で行われます。
     *
     * @param authToken 検証および解析対象のJWTトークン文字列。
     * @return JWTトークンから抽出されたユーザー名。
     */
    public String getUserNameFromJwtToken(String authToken) {
        // Jwtsパーサーを使用してJWTを解析します。
        return Jwts.parser()
                // トークンの署名を検証するための秘密鍵を設定します。`key()` メソッドで取得した秘密鍵を使用します。
                .verifyWith(key())
                // パーサーを構築します。
                .build()
                // 署名済みクレーム (claims) を解析します。トークンが無効な場合や署名が一致しない場合は例外が発生します。
                .parseSignedClaims(authToken)
                // 解析されたクレームのペイロード部分を取得します。
                .getPayload()
                // ペイロードから主題 (subject)、つまりユーザー名を取得します。
                .getSubject();
    }

    /**
     * JWTトークンが有効かどうかを検証します。
     *
     * @param authToken 検証するJWTトークン文字列。
     * @return トークンが有効な場合は true、無効な場合は false。
     */
    public boolean validateJwtToken(String authToken) {
        try {
            // Jwts.parser() でJWTパーサーのビルダーを取得します。
            // verifyWith(key()) で署名検証に使用する秘密鍵を設定します。key()メソッドは内部で秘密鍵を生成します。
            // build() でパーサーインスタンスを構築します。
            // parseSignedClaims(authToken) で実際にトークン文字列をパースし、署名を検証します。
            // この処理が成功すれば、トークンは有効とみなされます。
            Jwts.parser().verifyWith(key()).build().parseSignedClaims(authToken);
            return true; // 検証成功
        } catch (MalformedJwtException e) {
            // JWTの形式が不正な場合にスローされます。
            // 例: トークンが3つの部分（ヘッダー、ペイロード、署名）に分かれていない、Base64URLデコードに失敗するなど。
            LOGGER.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            // JWTの有効期限が切れている場合にスローされます。
            // 'exp'クレーム（有効期限）が現在時刻より過去の場合。
            LOGGER.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            // サポートされていない形式のJWTである場合にスローされます。
            // 例: 期待するアルゴリズムと異なる、JWSではないJWTを受信した場合など。
            LOGGER.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            // JWTのクレーム文字列が空であるなど、引数が不正な場合にスローされます。
            // authTokenがnullや空文字列の場合もここに含まれることがあります。
            LOGGER.error("JWT claims string is empty: {}", e.getMessage());
        } catch (SignatureException e) { // jjwt 0.12.x からは SecurityException のサブクラス
            // JWTの署名検証に失敗した場合にスローされます。
            // トークンが改ざんされているか、または正しい秘密鍵で署名されていない可能性があります。
            LOGGER.error("Invalid JWT signature: {}", e.getMessage());
        }
        // 上記のいずれかの例外が発生した場合（つまり、トークンが無効な場合）は false を返します。
        return false;
    }
}