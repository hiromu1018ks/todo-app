package com.example.todoapi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Todoアイテムを表すモデルクラスです。
 * このクラスのオブジェクトは、データベースのTodoテーブルの1行（レコード）に対応します。
 * Lombokというライブラリのアノテーションを使うことで、通常必要な基本的なメソッド
 * （ゲッター、セッター、toString、equalsなど）を自動的に生成しています。
 */
@Entity // このアノテーションは、このクラスがデータベースのテーブルと対応することを示します
@Data   // このLombokアノテーションは、全てのフィールドに対するゲッター、セッター、toString、equals、hashCodeメソッドを自動生成します
@NoArgsConstructor // このLombokアノテーションは、引数なしのコンストラクタを自動生成します
@AllArgsConstructor // このLombokアノテーションは、全てのフィールドを引数に持つコンストラクタを自動生成します
public class Todo {

    /**
     * Todoアイテムの識別子（ID）です。
     * このフィールドはデータベースのプライマリキー（主キー）として使われ、
     * データベースが自動的に番号を割り当てます。
     */
    @Id // このアノテーションは、このフィールドがプライマリキー（主キー）であることを示します
    @GeneratedValue(strategy = GenerationType.IDENTITY) // このアノテーションは、IDの値をデータベースが自動的に生成することを示します
    private Long id;

    /**
     * Todoアイテムのタイトルや内容を表す文字列です。
     * 例：「買い物に行く」、「レポートを作成する」など。
     * 空白や空文字は許可されず、最大100文字までという制限があります。
     */
    @NotBlank(message = "タイトルは必須です") // このアノテーションは、このフィールドが空白や空文字であってはならないことを示します
    @Size(max = 100, message = "タイトルは100文字以内で入力してください") // このアノテーションは、このフィールドの最大文字数を制限します
    private String title;

    /**
     * Todoアイテムが完了したかどうかを示すフラグです。
     * true の場合は「完了済み」、false の場合は「未完了」を表します。
     * 新しいTodoアイテムが作成されるとき、デフォルトでは false (未完了) に設定されます。
     */
    private boolean completed = false;
}
