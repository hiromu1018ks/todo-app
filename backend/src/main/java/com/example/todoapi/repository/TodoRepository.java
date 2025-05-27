package com.example.todoapi.repository;

import com.example.todoapi.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * {@link Todo} エンティティのためのデータアクセスレイヤ（リポジトリ）です。
 * このインターフェースは Spring Data JPA の {@link JpaRepository} を拡張しており、
 * {@link Todo} エンティティに対する基本的なCRUD（作成、読み取り、更新、削除）操作を
 * 自動的に提供します。
 *
 * {@code @Repository} アノテーションは、このインターフェースが Spring のコンポーネントであり、
 * データアクセス関連の例外を Spring の統一的な例外階層に変換する役割を持つことを示します。
 */
@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    // JpaRepository<Todo, Long> を継承することで、以下のようなメソッドが自動的に利用可能になります。
    // - save(Todo entity): エンティティを保存または更新します。
    // - findById(Long id): 指定されたIDのエンティティを検索します。
    // - findAll(): 全てのエンティティを検索します。
    // - deleteById(Long id): 指定されたIDのエンティティを削除します。
    // - count(): エンティティの総数を取得します。
    // その他多数のメソッドが提供されます。

    // ここに、JpaRepository が提供する標準的なメソッド以外に、
    // カスタムのクエリメソッドを定義することも可能です。
    // 例えば、完了済みのTodoアイテムのみを検索するメソッドや、
    // 特定のキーワードを含むタイトルを持つTodoアイテムを検索するメソッドなどです。
    // メソッド名は命名規則に従うことで、Spring Data JPA が自動的にクエリを生成します。
    // 例: List<Todo> findByCompleted(boolean completed);
}