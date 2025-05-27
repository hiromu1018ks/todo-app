package com.example.todoapi.service;

import com.example.todoapi.model.Todo;
import com.example.todoapi.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Todoアイテムに関するビジネスロジックを処理するサービスクラスです。
 * このクラスは、コントローラーからのリクエストを受け取り、
 * 必要に応じてデータベースとのやり取り（リポジトリ経由）を行い、結果を返します。
 */
@Service // このクラスがSpringのサービスコンポーネントであることを示します。ビジネスロジックを担当します。
@RequiredArgsConstructor // finalフィールドまたは@NonNullフィールドに対するコンストラクタをLombokが自動生成します。これにより、`todoRepository`がDI（依存性注入）されます。
public class TodoService {

    // TodoRepositoryへの参照を保持します。finalキーワードにより、このフィールドはコンストラクタで一度だけ初期化されます。
    // このリポジトリを通じて、Todoエンティティのデータベース操作を行います。
    private final TodoRepository todoRepository;

    /**
     * 全てのTodoアイテムを取得します。
     * データベースから全てのTodoレコードを検索し、リストとして返します。
     *
     * @return Todoアイテムのリスト。Todoアイテムが存在しない場合は空のリストを返します。
     */
    @Transactional(readOnly = true)
    // このメソッドがトランザクション内で実行されることを示します。readOnly = true は、この操作がデータベースの読み取り専用であり、更新を行わないことを示し、パフォーマンス最適化に役立ちます。
    public List<Todo> getAllTodos() {
        // TodoRepositoryのfindAllメソッドを呼び出し、全てのTodoエンティティを取得します。
        return todoRepository.findAll();
    }

    /**
     * 指定されたIDに基づいて特定のTodoアイテムを取得します。
     * データベースから指定されたIDを持つTodoレコードを検索します。
     *
     * @param id 取得したいTodoアイテムのID。
     * @return 指定されたIDに対応するTodoアイテムを含むOptional。アイテムが見つからない場合は空のOptionalを返します。
     * Optionalを使用することで、nullチェックの煩雑さを避け、値が存在しない可能性を明示的に扱えます。
     */
    @Transactional(readOnly = true) // 読み取り専用トランザクションであることを示します。
    public Optional<Todo> getTodoById(Long id) {
        // TodoRepositoryのfindByIdメソッドを呼び出し、指定されたIDのTodoエンティティを検索します。
        // 結果はOptional<Todo>で返され、Todoが見つかる場合と見つからない場合の両方に対応できます。
        return todoRepository.findById(id);
    }

    /**
     * 新しいTodoアイテムを作成（保存）します。
     * 引数で受け取ったTodoオブジェクトをデータベースに永続化します。
     *
     * @param todo 作成するTodoアイテムのデータを持つオブジェクト。IDは通常nullまたは未設定で、保存時に自動生成されます。
     * @return 保存されたTodoアイテム。IDが採番された状態のオブジェクトが返されます。
     */
    // このメソッドはデータベースへの書き込みを行うため、@Transactionalアノテーションを付与することが推奨されます（デフォルトではクラスレベルや親のトランザクション設定が適用されます）。
    // Spring Data JPAのsaveメソッドは、対象のエンティティが新規か既存かによって、内部的にinsertまたはupdateを実行します。
    public Todo createTodo(Todo todo) {
        // TodoRepositoryのsaveメソッドを呼び出し、新しいTodoエンティティをデータベースに保存します。
        // 引数の`todo`オブジェクトにIDが設定されていない場合（新規の場合）、データベースで新しいIDが割り当てられ、
        // そのIDを含む永続化されたTodoオブジェクトが返されます。
        return todoRepository.save(todo);
    }

    /**
     * 既存のTodoアイテムを更新します。
     * 指定されたIDのTodoアイテムを検索し、見つかった場合は提供された詳細情報で更新します。
     *
     * @param id          更新するTodoアイテムのID。
     * @param todoDetails 更新に使用する新しいタイトルと完了状態を含むTodoオブジェクト。
     * @return 更新が成功した場合は更新後のTodoアイテムを含むOptional。指定されたIDのアイテムが見つからない場合は空のOptionalを返します。
     */
    // このメソッドもデータベースへの書き込みを行うため、@Transactionalアノテーションを付与することが推奨されます。
    public Optional<Todo> updateTodo(Long id, Todo todoDetails) {
        // まず、指定されたIDで既存のTodoアイテムをデータベースから検索します。
        Optional<Todo> optionalTodo = todoRepository.findById(id);

        // Todoアイテムが見つかったかどうかを確認します。
        if (optionalTodo.isPresent()) {
            // OptionalからTodoオブジェクトを取得します。
            Todo existingTodo = optionalTodo.get();
            // 既存のTodoアイテムのタイトルを、引数で受け取った`todoDetails`のタイトルで更新します。
            existingTodo.setTitle(todoDetails.getTitle());
            // 既存のTodoアイテムの完了状態を、引数で受け取った`todoDetails`の完了状態で更新します。
            existingTodo.setCompleted(todoDetails.isCompleted());
            // 更新されたTodoアイテムをデータベースに保存し、その結果をOptionalでラップして返します。
            // `save`メソッドは、既存のIDを持つエンティティが渡された場合、更新処理を行います。
            return Optional.of(todoRepository.save(existingTodo));
        } else {
            // 指定されたIDのTodoアイテムが見つからなかった場合は、空のOptionalを返します。
            return Optional.empty();
        }
    }

    /**
     * 指定されたIDのTodoアイテムを削除します。
     * データベースから指定されたIDを持つTodoレコードを削除します。
     *
     * @param id 削除するTodoアイテムのID。
     * @return 削除が成功した場合はtrue、指定されたIDのアイテムが見つからず削除できなかった場合はfalseを返します。
     */
    // このメソッドもデータベースへの書き込み（削除）を行うため、@Transactionalアノテーションを付与することが推奨されます。
    public boolean deleteTodo(Long id) {
        // まず、指定されたIDのTodoアイテムがデータベースに存在するかどうかを確認します。
        if (todoRepository.existsById(id)) {
            // Todoアイテムが存在する場合、TodoRepositoryのdeleteByIdメソッドを呼び出して削除します。
            todoRepository.deleteById(id);
            // 削除が成功したことを示すためにtrueを返します。
            return true;
        } else {
            // 指定されたIDのTodoアイテムが見つからなかった場合は、削除できなかったことを示すためにfalseを返します。
            return false;
        }
    }
}