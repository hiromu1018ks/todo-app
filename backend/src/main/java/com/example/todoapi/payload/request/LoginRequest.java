package com.example.todoapi.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * ログインリクエストのデータを表すクラスです。
 * ユーザーがログインする際に送信する情報（ユーザー名とパスワード）を格納します。
 */
@Data // Lombokのアノテーションで、ゲッター、セッター、toString、equals、hashCodeメソッドを自動生成します。
public class LoginRequest {

    /**
     * ユーザー名。
     * {@link NotBlank} アノテーションにより、このフィールドはnullや空文字列であってはならず、
     * 少なくとも1つの空白以外の文字を含む必要があります。
     */
    @NotBlank
    private String username;

    /**
     * パスワード。
     * {@link NotBlank} アノテーションにより、このフィールドはnullや空文字列であってはならず、
     * 少なくとも1つの空白以外の文字を含む必要があります。
     */
    @NotBlank
    private String password;
}