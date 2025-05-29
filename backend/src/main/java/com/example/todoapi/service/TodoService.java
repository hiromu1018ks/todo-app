package com.example.todoapi.service;

import com.example.todoapi.model.Todo;
import com.example.todoapi.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * TO-DOアイテムの操作に関する処理を行うサービスクラスです。
 * このクラスは、コントローラー（画面からの要求を受け付ける部分）からの依頼を受けて、
 * データベースとのやり取りを行い、結果を返す役割を持っています。
 */
@Service // このアノテーションは、このクラスがSpringフレームワークのサービスとして動作することを示します。主にビジネスロジック（業務処理）を担当します。
@RequiredArgsConstructor // このLombokアノテーションは、finalフィールドを引数に持つコンストラクタを自動生成します。これにより、Springが自動的にtodoRepositoryを注入してくれます。
public class TodoService {

    // TodoRepositoryは、データベースとのやり取りを担当するインターフェースです。
    // finalキーワードは、このフィールドが一度初期化されたら変更できないことを示します。
    private final TodoRepository todoRepository;

    /**
     * 全てのTO-DOアイテムを取得するメソッドです。
     * データベースに保存されている全てのTO-DOを検索して、リストとして返します。
     *
     * @return TO-DOアイテムのリスト。TO-DOが1つも存在しない場合は空のリストを返します。
     */
    @Transactional(readOnly = true) // このアノテーションは、このメソッドがデータベースの読み取り専用の操作であることを示します。データの変更は行わないため、パフォーマンスが向上します。
    public List<Todo> getAllTodos() {
        // todoRepositoryのfindAllメソッドを使って、データベースから全てのTO-DOを取得します。
        return todoRepository.findAll();
    }

    /**
     * 指定されたIDのTO-DOアイテムを取得するメソッドです。
     * データベースから特定のIDを持つTO-DOを検索します。
     *
     * @param id 取得したいTO-DOのID番号
     * @return 見つかったTO-DOを含むOptional。TO-DOが見つからなかった場合は空のOptionalを返します。
     * Optionalは、値が存在するかしないかを表現するためのクラスで、nullチェックを簡単にします。
     */
    @Transactional(readOnly = true) // このメソッドはデータベースからの読み取りのみを行うことを示します。
    public Optional<Todo> getTodoById(Long id) {
        // todoRepositoryのfindByIdメソッドを使って、指定されたIDのTO-DOを検索します。
        // 結果はOptionalで包まれているため、TO-DOが存在しない場合でも安全に扱えます。
        return todoRepository.findById(id);
    }

    /**
     * 新しいTO-DOアイテムを作成して保存するメソッドです。
     * 受け取ったTO-DOオブジェクトをデータベースに保存します。
     *
     * @param todo 保存するTO-DOの情報を持つオブジェクト。IDは自動的に生成されるので設定しなくてOKです。
     * @return 保存されたTO-DO。データベースで生成されたIDが設定された状態で返されます。
     */
    public Todo createTodo(Todo todo) {
        // todoRepositoryのsaveメソッドを使って、新しいTO-DOをデータベースに保存します。
        // 新しいTO-DOの場合、データベースが自動的にIDを割り当てます。
        // saveメソッドは保存されたTO-DOオブジェクト（IDが設定された状態）を返します。
        return todoRepository.save(todo);
    }

    /**
     * 既存のTO-DOアイテムを更新するメソッドです。
     * 指定されたIDのTO-DOを検索し、見つかった場合は新しい情報で更新します。
     *
     * @param id          更新したいTO-DOのID番号
     * @param todoDetails 新しいタイトルと完了状態を含むTO-DOオブジェクト
     * @return 更新に成功した場合は更新後のTO-DOを含むOptional、TO-DOが見つからなかった場合は空のOptionalを返します
     */
    @Transactional // このアノテーションは、このメソッド内の処理が全て成功するか、全て失敗するかのどちらかであることを保証します（トランザクション処理）
    public Optional<Todo> updateTodo(Long id, Todo todoDetails) {
        // まず、指定されたIDのTO-DOがデータベースに存在するか確認します
        Optional<Todo> optionalTodo = todoRepository.findById(id);

        // TO-DOが見つかった場合の処理
        if (optionalTodo.isPresent()) {
            // 見つかったTO-DOを取得します
            Todo existingTodo = optionalTodo.get();
            // TO-DOのタイトルを新しい値に更新します
            existingTodo.setTitle(todoDetails.getTitle());
            // TO-DOの完了状態を新しい値に更新します
            existingTodo.setCompleted(todoDetails.isCompleted());
            // 更新したTO-DOをデータベースに保存し、Optionalで包んで返します
            return Optional.of(todoRepository.save(existingTodo));
        } else {
            // TO-DOが見つからなかった場合は、空のOptionalを返します
            return Optional.empty();
        }
    }

    /**
     * 指定されたIDのTO-DOアイテムを削除するメソッドです。
     * データベースから特定のTO-DOを削除します。
     *
     * @param id 削除したいTO-DOのID番号
     * @return 削除に成功した場合はtrue、指定されたIDのTO-DOが見つからなかった場合はfalseを返します
     */
    @Transactional // このアノテーションは、このメソッド内の処理が全て成功するか、全て失敗するかのどちらかであることを保証します
    public boolean deleteTodo(Long id) {
        // まず、指定されたIDのTO-DOがデータベースに存在するか確認します
        if (todoRepository.existsById(id)) {
            // TO-DOが存在する場合、そのTO-DOを削除します
            todoRepository.deleteById(id);
            // 削除に成功したことを示すためにtrueを返します
            return true;
        } else {
            // 指定されたIDのTO-DOが見つからなかった場合は、falseを返します
            return false;
        }
    }
}
