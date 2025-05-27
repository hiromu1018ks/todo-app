package com.example.todoapi; // あなたのパッケージ名に合わせてください

import com.example.todoapi.model.Todo;
import com.example.todoapi.repository.TodoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// import java.util.Arrays; // もし saveAll を使うなら必要

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final TodoRepository todoRepository;

    public DataInitializer(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("データベースの初期化を開始します...");

        // ↓↓↓ ここから追加 ↓↓↓
        logger.info("既存のTODOデータをクリアします...");
        todoRepository.deleteAll(); // ← この行で全てのTODOデータを削除します
        logger.info("既存のTODOデータをクリアしました。");
        // ↑↑↑ ここまで追加 ↑↑↑

        // 作成したいテストデータを定義する
        Todo todo1 = new Todo(null, "牛乳を買う", false);
        Todo todo2 = new Todo(null, "Spring Bootの勉強をする", true);
        Todo todo3 = new Todo(null, "部屋の掃除をする", false);
        Todo todo4 = new Todo(null, "Reactのコンポーネントを作成する", false);

        // データをデータベースに保存する
        todoRepository.save(todo1);
        todoRepository.save(todo2);
        todoRepository.save(todo3);
        todoRepository.save(todo4);

        logger.info("テストデータの投入が完了しました。登録件数: {}", todoRepository.count());
        todoRepository.findAll().forEach(todo -> logger.info("登録されたTODO: {}", todo));
    }
}