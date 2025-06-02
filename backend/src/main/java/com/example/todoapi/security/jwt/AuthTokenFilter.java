package com.example.todoapi.security.jwt;

import com.example.todoapi.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWTトークンを使用した認証フィルター
 * リクエストごとに一度だけ実行され、JWTトークンの検証と認証を行う
 */
public class AuthTokenFilter extends OncePerRequestFilter {
    /**
     * JWTトークンの操作に関するユーティリティ
     */
    @Autowired
    private JwtUtils jwtUtils;

    /**
     * ユーザー詳細情報を取得するためのサービス
     */
    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    /**
     * ログ出力用のロガー
     */
    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    /**
     * リクエスト処理のメインメソッド
     * HTTPリクエストからJWTトークンを抽出し、検証して認証コンテキストを設定する
     *
     * @param request     HTTPリクエスト
     * @param response    HTTPレスポンス
     * @param filterChain フィルターチェーン
     * @throws ServletException サーブレット例外
     * @throws IOException      入出力例外
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // リクエストからJWTトークンを取得
            String jwt = parseJwt(request);

            // トークンが存在し、有効な場合に認証処理を行う
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                // トークンからユーザー名を取得
                String username = jwtUtils.getUserNameFromJwtToken(jwt);

                // ユーザー名からユーザー詳細情報を取得
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // 認証トークンを作成
                // 第1引数: ユーザー詳細情報
                // 第2引数: 資格情報（ここではnull）
                // 第3引数: ユーザーの権限情報
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());

                // リクエスト詳細情報を認証トークンに追加
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // セキュリティコンテキストに認証情報を設定
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            // 認証設定中にエラーが発生した場合はログに記録
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }

        // フィルターチェーンの次のフィルターを呼び出し
        filterChain.doFilter(request, response);
    }

    /**
     * HTTPリクエストからJWTトークンを抽出するメソッド
     *
     * @param request HTTPリクエスト
     * @return 抽出されたJWTトークン。トークンが見つからない場合はnull
     */
    private String parseJwt(HttpServletRequest request) {
        // Authorizationヘッダーを取得
        String headerAuth = request.getHeader("Authorization");

        // ヘッダーが存在し、"Bearer "で始まる場合はトークン部分を抽出
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7); // "Bearer "の後の部分（実際のトークン）を返す
        }

        return null;
    }
}