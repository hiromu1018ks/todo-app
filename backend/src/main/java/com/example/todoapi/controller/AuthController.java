package com.example.todoapi.controller;

import com.example.todoapi.model.User;
import com.example.todoapi.payload.request.LoginRequest;
import com.example.todoapi.payload.request.RegisterRequest;
import com.example.todoapi.payload.response.JwtResponse;
import com.example.todoapi.repository.UserRepository;
import com.example.todoapi.security.jwt.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * 認証関連のAPIリクエストを処理するコントローラークラスです。
 * ユーザー登録やログイン機能を提供します。
 */
@CrossOrigin(origins = "*", maxAge = 3600) // CORS設定: 全てのオリジンからのリクエストを許可し、プリフライトリクエストの結果を1時間キャッシュします。
@RestController // このクラスがRESTfulなリクエストを処理するコントローラーであることを示します。レスポンスは自動的にJSONなどに変換されます。
@RequestMapping("/api/auth") // このコントローラーのベースURLパスを指定します。全てのリクエストはこのパスの下にマッピングされます。
@RequiredArgsConstructor // finalフィールド、または@NonNullアノテーションが付いたフィールドに対するコンストラクタを自動生成します（Lombok）。
public class AuthController {

    /**
     * Spring Securityの認証処理を行うためのマネージャークラスです。
     * ユーザー名とパスワードによる認証を実行します。
     */
    private final AuthenticationManager authenticationManager;

    /**
     * ユーザー情報をデータベースとやり取りするためのリポジトリインターフェースです。
     * ユーザーの検索、保存、存在確認などに使用します。
     */
    private final UserRepository userRepository;

    /**
     * パスワードを安全にハッシュ化（エンコード）するためのエンコーダーです。
     * データベースにパスワードをそのまま保存するのではなく、ハッシュ化して保存するために使用します。
     */
    private final PasswordEncoder passwordEncoder;

    /**
     * JWT (JSON Web Token) の生成と検証を行うためのユーティリティクラスです。
     * 認証成功後にJWTを生成し、クライアントに返します。
     */
    private final JwtUtils jwtUtils;

    /**
     * 新規ユーザーを登録するためのAPIエンドポイントです。
     * "/api/auth/register" パスへのPOSTリクエストを処理します。
     *
     * @param registerRequest 登録リクエストのデータ（ユーザー名、パスワード）を格納したオブジェクト。リクエストボディから取得し、バリデーションを行います。
     * @return 登録処理の結果を示すResponseEntity。成功時はHTTPステータス200 OKとメッセージ、失敗時は400 Bad Requestとエラーメッセージを返します。
     */
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        // 提供されたユーザー名が既にデータベースに存在するかどうかを確認します。
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            // ユーザー名が既に存在する場合、400 Bad Requestエラーとメッセージを返します。
            return ResponseEntity
                    .badRequest()
                    .body("エラー: ユーザー名は既に使用されています。");
        }

        // 新しいUserオブジェクトを作成します。
        User user = new User();
        // リクエストから取得したユーザー名を設定します。
        user.setUsername(registerRequest.getUsername());
        // リクエストから取得したパスワードをエンコードして設定します。
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        // 新しいユーザー情報をデータベースに保存します。
        userRepository.save(user);

        // 登録成功のメッセージとともに200 OKレスポンスを返します。
        return ResponseEntity.ok("ユーザー登録が正常に完了しました。");
    }

    /**
     * 既存ユーザーを認証するためのAPIエンドポイントです。
     * "/api/auth/login" パスへのPOSTリクエストを処理します。
     *
     * @param loginRequest ログインリクエストのデータ（ユーザー名、パスワード）を格納したオブジェクト。リクエストボディから取得し、バリデーションを行います。
     * @return 認証結果を含むResponseEntity。成功時はJWTトークンとユーザー情報を含むJwtResponse、失敗時はエラー情報（Spring Securityが処理）を返します。
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        // AuthenticationManagerを使用して、提供されたユーザー名とパスワードで認証を試みます。
        // UsernamePasswordAuthenticationTokenは、ユーザー名とパスワードを保持するためのAuthentication実装です。
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        // 認証が成功した場合、SecurityContextHolderに認証情報を設定します。
        // これにより、アプリケーションの他の部分で現在の認証済みユーザーにアクセスできるようになります。
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 認証情報を使用してJWTトークンを生成します。
        String jwt = jwtUtils.generateJwtToken(authentication);

        // 認証情報からUserDetailsオブジェクトを取得します。これには認証されたユーザーの詳細が含まれます。
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // UserDetailsからユーザー名を取得し、それを使用してデータベースから完全なUserエンティティを取得します。
        // orElseThrowは、ユーザーが見つからない場合にRuntimeExceptionをスローします（通常、認証が成功していればこの状況は発生しません）。
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow(
                () -> new RuntimeException("エラー: 認証後にユーザーが見つかりません（これは発生すべきではありません）")
        );

        // JWT、ユーザーID、ユーザー名を含むJwtResponseオブジェクトを作成し、200 OKレスポンスで返します。
        return ResponseEntity.ok(new JwtResponse(jwt,
                user.getId(),
                user.getUsername()));
    }
}