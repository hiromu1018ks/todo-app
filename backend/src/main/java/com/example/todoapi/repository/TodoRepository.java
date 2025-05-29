package com.example.todoapi.repository;

import com.example.todoapi.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Todoデータをデータベースに保存したり取得したりするためのインターフェースです。
 * このインターフェースは、Spring Data JPAというライブラリの機能を利用して、
 * データベース操作のための基本的なメソッド（作成、読み取り、更新、削除）を
 * 自動的に提供します。
 */
@Repository // このアノテーションは、このインターフェースがデータベースとのやり取りを担当することを示します
public interface TodoRepository extends JpaRepository<Todo, Long> {
    // JpaRepositoryを継承することで、以下のようなメソッドが自動的に使えるようになります：
    //
    // - save(Todo todo): Todoを保存または更新します
    // - findById(Long id): 指定されたIDのTodoを検索します
    // - findAll(): 全てのTodoを検索します
    // - deleteById(Long id): 指定されたIDのTodoを削除します
    // - count(): Todoの総数を取得します
    //
    // これらのメソッドは自動的に提供されるため、自分で実装する必要はありません。
    // Springが自動的にデータベース操作のコードを生成してくれます。

    // 必要に応じて、ここに独自のメソッドを追加することもできます。
    // 例えば、完了済みのTodoだけを取得するメソッドや、
    // タイトルに特定の単語を含むTodoを検索するメソッドなどです。
    // 例: List<Todo> findByCompleted(boolean completed);
}
