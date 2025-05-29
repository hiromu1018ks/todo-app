package com.example.todoapi.controller;

import com.example.todoapi.model.Todo;
import com.example.todoapi.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * TO-DOアイテムに関するWebリクエストを処理するコントローラークラスです。
 * このクラスは、フロントエンド（ブラウザやスマホアプリなど）からのリクエストを受け取り、
 * TO-DOの取得、作成、更新、削除などの操作を行うためのエンドポイント（URL）を提供します。
 */
@RestController // このアノテーションは、このクラスがRESTful APIのコントローラーであることを示します。メソッドの戻り値がそのままレスポンスのデータになります。
@RequestMapping("/api/todos") // このアノテーションは、このコントローラーのURLの共通部分を指定します。例：「/api/todos」で始まるURLはこのコントローラーが処理します。
@CrossOrigin(origins = "*") // このアノテーションは、異なるドメイン（例：フロントエンドが別サーバーにある場合）からのアクセスを許可します。
@RequiredArgsConstructor // このLombokアノテーションは、finalフィールドを引数に持つコンストラクタを自動生成します。
public class TodoController {

    // TodoServiceは、TO-DOの操作に関する処理を行うクラスです。
    // コントローラーはリクエストを受け取り、実際の処理はServiceに任せます。
    private final TodoService todoService;

    /**
     * すべてのTO-DOアイテムを取得するメソッドです。
     * ブラウザやアプリから「/api/todos」というURLにGETリクエストが送られると、このメソッドが実行されます。
     *
     * @return すべてのTO-DOアイテムのリストと、成功を示すステータスコード（200 OK）を返します。
     */
    @GetMapping // このアノテーションは、HTTPのGETリクエストを処理することを示します。URLは@RequestMappingで指定した「/api/todos」になります。
    public ResponseEntity<List<Todo>> getAllTodos() {
        // TodoServiceを使って、すべてのTO-DOアイテムを取得します
        List<Todo> todos = todoService.getAllTodos();
        // 取得したTO-DOのリストと、成功を示すステータスコード（200 OK）を返します
        return ResponseEntity.ok(todos);
    }

    /**
     * 特定のIDを持つTo-doアイテムを取得するメソッドです。
     * 「/api/todos/1」のようなURLにGETリクエストが送られると、このメソッドが実行されます。
     * URLの最後の数字（この例では「1」）が、取得したいTo-doのIDになります。
     *
     * @param id 取得したいTo-doのID番号（URLの「/api/todos/」の後の数字）
     * @return 指定されたIDのTo-doが見つかった場合は、そのTo-doと成功ステータス（200 OK）を返します。
     * 見つからなかった場合は、「見つかりません」を意味するステータス（404 Not Found）を返します。
     */
    @GetMapping("/{id}") // このアノテーションは、「/api/todos/{id}」というURLパターンのGETリクエストを処理することを示します。{id}は変数部分です。
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) { // @PathVariableは、URLの{id}部分の値をこのパラメータに設定することを示します
        // TodoServiceを使って、指定されたIDのTo-doを検索します
        Optional<Todo> optionalTodo = todoService.getTodoById(id);
        // To-doが見つかった場合は、そのTo-doと成功ステータス（200 OK）を返します
        // 見つからなかった場合は、「見つかりません」ステータス（404 Not Found）を返します
        return optionalTodo.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * 新しいTo-doアイテムを作成するメソッドです。
     * 「/api/todos」というURLにPOSTリクエスト（データ作成用のリクエスト）が送られると、このメソッドが実行されます。
     * リクエストのボディ（内容）には、新しいTo-doの情報（タイトルなど）がJSON形式で含まれています。
     *
     * @param todo リクエストボディから取得した、新しく作成するTo-doの情報
     * @return 作成されたTo-doと、作成成功を示すステータスコード（201 Created）を返します
     */
    @PostMapping // このアノテーションは、HTTPのPOSTリクエスト（データ作成用）を処理することを示します
    public ResponseEntity<Todo> createTodo(@Valid @RequestBody Todo todo) { // @Validは入力データの検証、@RequestBodyはリクエストの内容をTodoオブジェクトに変換することを示します
        // TodoServiceを使って、新しいTo-doを作成します
        Todo createdTodo = todoService.createTodo(todo);
        // 作成されたTo-doと、作成成功を示すステータスコード（201 Created）を返します
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
    }

    /**
     * 既存のTo-doアイテムを更新するメソッドです。
     * 「/api/todos/1」のようなURLにPUTリクエスト（データ更新用のリクエスト）が送られると、このメソッドが実行されます。
     * URLの最後の数字（この例では「1」）が、更新したいTodoのIDになります。
     * リクエストのボディには、Todoの新しい情報（タイトルや完了状態など）がJSON形式で含まれています。
     *
     * @param id          更新したいTodoのID番号（URLの「/api/todos/」の後の数字）
     * @param todoDetails リクエストボディから取得した、Todoの新しい情報
     * @return 更新に成功した場合は、更新後のTodoと成功ステータス（200 OK）を返します。
     * Todoが見つからなかった場合は、「見つかりません」ステータス（404 Not Found）を返します。
     */
    @PutMapping("/{id}") // このアノテーションは、「/api/todos/{id}」というURLパターンのPUTリクエスト（更新用）を処理することを示します
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @Valid @RequestBody Todo todoDetails) {
        // TodoServiceを使って、指定されたIDのTo-doを更新します
        Optional<Todo> optionalTodo = todoService.updateTodo(id, todoDetails);
        // 更新に成功した場合は、更新後のTo-doと成功ステータス（200 OK）を返します
        // To-doが見つからなかった場合は、「見つかりません」ステータス（404 Not Found）を返します
        return optionalTodo.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Todoアイテムを削除するメソッドです。
     * 「/api/todos/1」のようなURLにDELETEリクエスト（データ削除用のリクエスト）が送られると、このメソッドが実行されます。
     * URLの最後の数字（この例では「1」）が、削除したいTodoのIDになります。
     *
     * @param id 削除したいTodoのID番号（URLの「/api/todos/」の後の数字）
     * @return 削除に成功した場合は、「内容なし」を意味するステータスコード（204 No Content）を返します。
     * Todoが見つからなかった場合は、「見つかりません」ステータス（404 Not Found）を返します。
     */
    @DeleteMapping("/{id}") // このアノテーションは、「/api/todos/{id}」というURLパターンのDELETEリクエスト（削除用）を処理することを示します
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        // TodoServiceを使って、指定されたIDのTo-doを削除します
        boolean isDeleted = todoService.deleteTodo(id);
        // 削除に成功した場合
        if (isDeleted) {
            // 「内容なし」を意味するステータスコード（204 No Content）を返します
            // 削除が成功したので返すデータはありません
            return ResponseEntity.noContent().build();
        } else {
            // To-doが見つからなかった場合は、「見つかりません」ステータス（404 Not Found）を返します
            return ResponseEntity.notFound().build();
        }
    }
}
