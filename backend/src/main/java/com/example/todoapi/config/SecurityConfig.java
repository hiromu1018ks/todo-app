package com.example.todoapi.config;

import com.example.todoapi.security.jwt.AuthTokenFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Spring Securityの設定クラスです。
 * アプリケーションのセキュリティ関連の設定を定義します。
 */
@Configuration // このクラスが設定クラスであることを示します。Springコンテナによって管理されます。
@EnableWebSecurity // Spring Securityを有効にし、Webセキュリティのサポートを提供します。
@EnableMethodSecurity(prePostEnabled = true) // メソッドレベルのセキュリティを有効にします。@PreAuthorizeなどのアノテーションが使用可能になります。
public class SecurityConfig {

    /**
     * JWTトークン認証用のフィルターをBeanとして登録します。
     * このフィルターはリクエストからJWTトークンを抽出し、ユーザー認証を行います。
     *
     * @return JWTトークン認証フィルターのインスタンス
     */
    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }

    /**
     * パスワードエンコーダーをSpringのBeanとして登録します。
     * パスワードのハッシュ化に使用されるBCryptPasswordEncoderのインスタンスを返します。
     *
     * @return PasswordEncoderのインスタンス
     */
    @Bean // このメソッドが返すオブジェクトをSpringのBeanとして登録します。
    public PasswordEncoder passwordEncoder() {
        // BCryptアルゴリズムを使用してパスワードをエンコードするエンコーダーを返します。
        return new BCryptPasswordEncoder();
    }

    /**
     * 認証マネージャーをSpringのBeanとして登録します。
     * AuthenticationConfigurationから認証マネージャーを取得します。
     * このメソッドは認証処理の中心的な役割を担います。
     *
     * @param authConfig 認証設定オブジェクト
     * @return AuthenticationManagerのインスタンス
     * @throws Exception AuthenticationManagerの取得中に例外が発生した場合
     */
    @Bean
    public AuthenticationManager authenticationManagerBean(AuthenticationConfiguration authConfig) throws Exception {
        // 認証設定から認証マネージャーを取得して返します。
        return authConfig.getAuthenticationManager();
    }

    @Bean // (2) CORS設定をBeanとして定義
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // (3) フロントエンドのオリジンを許可
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // (4) 許可するHTTPメソッド
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept")); // (5) 許可するヘッダー
        configuration.setAllowCredentials(true); // (6) Cookieなどの認証情報を許可する場合 (今回はJWTなので必須ではないが、設定しておいても良い)
        configuration.setMaxAge(3600L); // (7) プリフライトリクエストの結果をキャッシュする時間 (秒)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // (8) 全てのパスに対してこのCORS設定を適用
        return source;
    }

    /**
     * セキュリティフィルターチェーンをSpringのBeanとして登録します。
     * HTTPリクエストに対するセキュリティ設定（CSRF対策、認可ルールなど）を定義します。
     *
     * @param http HttpSecurityオブジェクト。セキュリティ設定を構成するために使用します。
     * @return SecurityFilterChainのインスタンス
     * @throws Exception SecurityFilterChainの構築中に例外が発生した場合
     */
    @Bean // このメソッドが返すオブジェクトをSpringのBeanとして登録します。
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // ★★★ この行を追加 ★★★
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/todos/**").authenticated()
                        .anyRequest().authenticated()
                );

        // JWTトークン認証フィルターをUsernamePasswordAuthenticationFilterの前に追加します。
        // これにより、ユーザー名/パスワード認証の前にJWTトークンでの認証が試行されます。
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        // 設定に基づいてSecurityFilterChainを構築し、返します。
        return http.build();
    }
}