package com.example.todoapi.payload.response;

import lombok.Data;

/**
 * JWT（JSON Web Token）認証のレスポンスデータを表すクラスです。
 * 認証成功時にクライアントに返却される情報を保持します。
 */
@Data // Lombokのアノテーションで、ゲッター、セッター、toString、equals、hashCodeメソッドを自動生成します。
public class JwtResponse {

    /**
     * 認証後に発行されたJWTトークン文字列です。
     * このトークンは、以降の認証が必要なリクエストで利用されます。
     */
    private String token;

    /**
     * トークンの種類を示します。デフォルトは "Bearer" です。
     * "Bearer" トークンは、OAuth 2.0 で一般的に使用されるトークンタイプです。
     */
    private String type = "Bearer";

    /**
     * 認証されたユーザーの一意なIDです。
     * データベースなどでユーザーを識別するために使用されます。
     */
    private Long id;

    /**
     * 認証されたユーザーのユーザー名です。
     */
    private String username;

    /**
     * JwtResponseオブジェクトを初期化するためのコンストラクタです。
     *
     * @param token    認証トークン
     * @param id       ユーザーID
     * @param username ユーザー名
     */
    public JwtResponse(String token, Long id, String username) {
        this.token = token; // 引数で渡されたトークンを、このオブジェクトのtokenフィールドに設定します。
        this.id = id;       // 引数で渡されたIDを、このオブジェクトのidフィールドに設定します。
        this.username = username; // 引数で渡されたユーザー名を、このオブジェクトのusernameフィールドに設定します。
    }
}