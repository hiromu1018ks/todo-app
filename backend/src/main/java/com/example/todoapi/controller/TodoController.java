package com.example.todoapi.controller;

import com.example.todoapi.model.Todo;
import com.example.todoapi.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Todoアイテムに関するHTTPリクエストを処理するコントローラークラスです。
 * このクラスは、Todoアイテムの取得、作成、更新、削除のエンドポイントを提供します。
 */
@RestController // このクラスがRESTfulなリクエストを処理するコントローラーであることを示します。各メソッドの戻り値は直接レスポンスボディに書き込まれます。
@RequestMapping("/api/todos") // このコントローラー内のすべてのリクエストハンドラメソッドのベースURLパスを指定します。つまり、すべてのエンドポイントは "/api/todos" から始まります。
@CrossOrigin(origins = "*") // クロスオリジンリソース共有(CORS)を許可します。"*" はすべてのオリジンからのリクエストを許可することを意味します。
@RequiredArgsConstructor // Lombokのアノテーションで、finalフィールドまたは@NonNullアノテーションが付与されたフィールドを引数に取るコンストラクタを自動生成します。
public class TodoController {

    // TodoServiceへの依存性注入。Todoアイテムに関するビジネスロジックを処理します。
    // finalキーワードにより、このフィールドはコンストラクタで初期化される必要があります。
    // @RequiredArgsConstructorによって、このフィールドを含むコンストラクタが自動生成されます。
    private final TodoService todoService;

    /**
     * すべてのTodoアイテムを取得するためのGETリクエストを処理します。
     * HTTP GETリクエストが "/api/todos" に送信されると、このメソッドが呼び出されます。
     *
     * @return Todoアイテムのリストを含むResponseEntity。リストが空の場合でも、ステータスコード200 (OK) と空のリストを返します。
     */
    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos() {
        // todoServiceを通じてすべてのTodoアイテムを取得します。
        List<Todo> todos = todoService.getAllTodos();
        // 取得したTodoアイテムのリストとHTTPステータス200 (OK) を含むResponseEntityを返します。
        return ResponseEntity.ok(todos);
    }

    /**
     * 指定されたIDのTodoアイテムを取得するためのGETリクエストを処理します。
     * HTTP GETリクエストが "/api/todos/{id}" (例: "/api/todos/1") に送信されると、このメソッドが呼び出されます。
     *
     * @param id 取得するTodoアイテムのID。URLパスから抽出されます。
     * @return 指定されたIDのTodoアイテムが見つかった場合は、そのアイテムとHTTPステータス200 (OK) を含むResponseEntityを返します。
     * 見つからなかった場合は、HTTPステータス404 (Not Found) を返します。
     */
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        // todoServiceを通じて指定されたIDのTodoアイテムを検索します。結果はOptional<Todo>で返されます。
        Optional<Todo> optionalTodo = todoService.getTodoById(id);
        // Optional<Todo>にTodoアイテムが存在すれば (map)、そのアイテムとHTTPステータス200 (OK) でレスポンスを構築します。
        // 存在しなければ (orElseGet)、HTTPステータス404 (Not Found) でレスポンスを構築します。
        return optionalTodo.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 新しいTodoアイテムを作成するためのPOSTリクエストを処理します。
     * HTTP POSTリクエストが "/api/todos" に送信されると、このメソッドが呼び出されます。
     * リクエストボディには、作成するTodoアイテムのデータ（例: JSON形式）が含まれている必要があります。
     *
     * @param todo リクエストボディからマッピングされたTodoオブジェクト。
     * @return 作成されたTodoアイテムとHTTPステータス201 (Created) を含むResponseEntityを返します。
     */
    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
        // todoServiceを通じて新しいTodoアイテムを作成します。
        Todo createdTodo = todoService.createTodo(todo);
        // 作成されたTodoアイテムとHTTPステータス201 (Created) を含むResponseEntityを返します。
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
    }

    /**
     * 指定されたIDのTodoアイテムを更新するためのPUTリクエストを処理します。
     * HTTP PUTリクエストが "/api/todos/{id}" (例: "/api/todos/1") に送信されると、このメソッドが呼び出されます。
     * リクエストボディには、更新するTodoアイテムの新しいデータが含まれている必要があります。
     *
     * @param id          更新するTodoアイテムのID。URLパスから抽出されます。
     * @param todoDetails リクエストボディからマッピングされた、更新情報を含むTodoオブジェクト。
     * @return 更新されたTodoアイテムが見つかった場合は、そのアイテムとHTTPステータス200 (OK) を含むResponseEntityを返します。
     * 見つからなかった場合は、HTTPステータス404 (Not Found) を返します。
     */
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        // todoServiceを通じて指定されたIDのTodoアイテムを更新します。結果はOptional<Todo>で返されます。
        Optional<Todo> optionalTodo = todoService.updateTodo(id, todoDetails);
        // Optional<Todo>に更新されたTodoアイテムが存在すれば (map)、そのアイテムとHTTPステータス200 (OK) でレスポンスを構築します。
        // 存在しなければ (orElseGet)、HTTPステータス404 (Not Found) でレスポンスを構築します。
        return optionalTodo.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 指定されたIDのTodoアイテムを削除するためのDELETEリクエストを処理します。
     * HTTP DELETEリクエストが "/api/todos/{id}" (例: "/api/todos/1") に送信されると、このメソッドが呼び出されます。
     *
     * @param id 削除するTodoアイテムのID。URLパスから抽出されます。
     * @return Todoアイテムが正常に削除された場合は、HTTPステータス204 (No Content) を含むResponseEntityを返します。
     * 削除対象のTodoアイテムが見つからなかった場合は、HTTPステータス404 (Not Found) を返します。
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        // todoServiceを通じて指定されたIDのTodoアイテムを削除します。削除に成功したかどうかを示すboolean値が返されます。
        boolean isDeleted = todoService.deleteTodo(id);
        // 削除に成功した場合は、HTTPステータス204 (No Content) でレスポンスを構築します。
        if (isDeleted) {
            return ResponseEntity.noContent().build();
        } else {
            // 削除に失敗した場合 (対象が見つからなかった場合など) は、HTTPステータス404 (Not Found) でレスポンスを構築します。
            return ResponseEntity.notFound().build();
        }
    }
}