//package com.example.todoapi;
//
//import com.example.todoapi.model.Todo;
//import com.example.todoapi.repository.TodoRepository;
//import lombok.RequiredArgsConstructor;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import java.util.Arrays;
//
/// **
// * アプリケーション起動時にデータベースに初期データを投入するクラスです。
// * このクラスは、アプリケーションが起動するたびに実行され、
// * テスト用のTodoデータをデータベースに登録します。
// */
//@Component // このアノテーションは、このクラスがSpringのコンポーネント（部品）であることを示します
//@RequiredArgsConstructor // このLombokアノテーションは、finalフィールドを引数に持つコンストラクタを自動生成します
//public class DataInitializer implements CommandLineRunner { // CommandLineRunnerインターフェースを実装することで、アプリ起動時に自動実行されます
//
//    // ログを出力するためのロガーオブジェクトです。アプリケーションの動作状況を記録するのに使います。
//    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
//
//    // TodoRepositoryは、Todoデータをデータベースに保存したり取得したりするためのインターフェースです
//    private final TodoRepository todoRepository;
//
//    /**
//     * アプリケーション起動時に自動的に実行されるメソッドです。
//     * データベースをクリアして、テスト用のTodoデータを登録します。
//     */
//    @Override
//    public void run(String... args) throws Exception {
//        // ログにデータベース初期化開始のメッセージを出力します
//        logger.info("データベースの初期化を開始します...");
//
//        // 既存のデータを全て削除します
//        logger.info("既存のTODOデータをクリアします...");
//        todoRepository.deleteAll();
//        logger.info("既存のTODOデータをクリアしました。");
//
//        // テスト用のTodoデータを作成します
//        // 最初の引数（null）はIDで、データベースが自動的に割り当てるのでnullにしています
//        // 2番目の引数はタイトル、3番目の引数は完了状態（true=完了、false=未完了）です
//        Todo todo1 = new Todo(null, "牛乳を買う", false);
//        Todo todo2 = new Todo(null, "Spring Bootの勉強をする", true);
//        Todo todo3 = new Todo(null, "部屋の掃除をする", false);
//        Todo todo4 = new Todo(null, "Reactのコンポーネントを作成する", false);
//
//        // 作成したTodoデータをデータベースに一括で保存します
//        todoRepository.saveAll(Arrays.asList(todo1, todo2, todo3, todo4));
//
//        // データ登録完了のログを出力します。{}の部分には、todoRepository.count()の結果（登録件数）が入ります。
//        logger.info("テストデータの投入が完了しました。登録件数: {}", todoRepository.count());
//        // 登録されたTodoデータを全て取得し、それぞれについてログに出力します
//        todoRepository.findAll().forEach(todo -> logger.info("登録されたTODO: {}", todo));
//    }
//}
