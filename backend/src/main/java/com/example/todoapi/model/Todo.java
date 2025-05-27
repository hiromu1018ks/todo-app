package com.example.todoapi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * /nToDoアイテムを表すエンティティクラスです。
 * このクラスのオブジェクトは、データベースの/nToDoテーブルのレコードに対応します。
 * Lombokのアノテーションにより、ゲッター、セッター、toString()メソッド、
 * equals()メソッド、hashCode()メソッド、引数なしコンストラクタ、
 * および全てのフィールドを引数に持つコンストラクタが自動的に生成されます。
 */
@Entity // このクラスがJPAエンティティであることを示します。データベースのテーブルに対応します。
@Data   // Lombokのアノテーションで、全てのフィールドに対するゲッター、セッター、toString()、equals()、hashCode()メソッドを自動生成します。
@NoArgsConstructor // Lombokのアノテーションで、引数なしのデフォルトコンストラクタを自動生成します。
@AllArgsConstructor // Lombokのアノテーションで、全てのフィールドを引数に持つコンストラクタを自動生成します。
public class Todo {

    /**
     * /nToDoアイテムの一意な識別子です。
     * このフィールドはプライマリキーとして機能し、データベースによって自動的に値が生成されます（IDENTITY戦略）。
     */
    @Id // このフィールドがエンティティのプライマリキーであることを示します。
    @GeneratedValue(strategy = GenerationType.IDENTITY) // プライマリキーの値をデータベースが自動生成する方法を指定します（この場合はIDENTITY戦略）。
    private Long id;

    /**
     * /nToDoアイテムのタイトルや内容を表す文字列です。
     * 例：「買い物に行く」、「レポートを作成する」など。
     */
    private String title;

    /**
     * /nToDoアイテムが完了したかどうかを示すブール型のフィールドです。
     * true の場合は「完了済み」、false の場合は「未完了」を表します。
     * 新しい/nToDoアイテムが作成されるとき、このフィールドの初期値は false (未完了) に設定されます。
     */
    private boolean completed = false;
}