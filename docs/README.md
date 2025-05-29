# TODOアプリケーション ドキュメント

## 目次
1. [プロジェクト概要](#プロジェクト概要)
2. [システムアーキテクチャ](#システムアーキテクチャ)
3. [バックエンドコンポーネント](#バックエンドコンポーネント)
4. [フロントエンドコンポーネント](#フロントエンドコンポーネント)
5. [アプリケーションの実行方法](#アプリケーションの実行方法)
6. [APIエンドポイント](#apiエンドポイント)

## プロジェクト概要

このTODOアプリケーションは、ユーザーがタスクを管理するためのシンプルなウェブアプリケーションです。ユーザーは新しいTODOアイテムを作成し、完了状態を切り替え、不要なアイテムを削除することができます。

このアプリケーションは、Spring Boot（バックエンド）とReact（フロントエンド）を使用した現代的なウェブアプリケーションの基本的な構造を示しています。

## システムアーキテクチャ

このアプリケーションは、以下の2つの主要なコンポーネントで構成されています：

1. **バックエンド**：Java言語とSpring Bootフレームワークを使用したRESTful API
2. **フロントエンド**：TypeScriptとReactを使用したシングルページアプリケーション（SPA）

### 技術スタック

- **バックエンド**：
  - 言語：Java
  - フレームワーク：Spring Boot
  - データベース：H2（インメモリデータベース）
  - ビルドツール：Maven

- **フロントエンド**：
  - 言語：TypeScript
  - フレームワーク：React
  - スタイリング：Tailwind CSS
  - HTTPクライアント：Axios

- **開発環境**：
  - Docker（コンテナ化）
  - Docker Compose（マルチコンテナアプリケーション管理）

## バックエンドコンポーネント

バックエンドは、Spring Bootを使用したRESTful APIとして実装されています。主要なコンポーネントは以下の通りです：

### モデル（Model）

`Todo`クラスは、TODOアイテムのデータ構造を定義します：

- `id`：TODOの一意の識別子（自動生成）
- `title`：TODOのタイトルまたは内容（最大100文字）
- `completed`：TODOの完了状態（true=完了、false=未完了）

### リポジトリ（Repository）

`TodoRepository`インターフェースは、Spring Data JPAを使用してデータベース操作を行います。以下の基本的なCRUD操作が自動的に提供されます：

- `save(Todo todo)`：TODOを保存または更新
- `findById(Long id)`：指定されたIDのTODOを検索
- `findAll()`：全てのTODOを検索
- `deleteById(Long id)`：指定されたIDのTODOを削除
- `count()`：TODOの総数を取得

### サービス（Service）

`TodoService`クラスは、ビジネスロジックを実装し、コントローラーとリポジトリの間を仲介します：

- `getAllTodos()`：全てのTODOアイテムを取得
- `getTodoById(Long id)`：指定されたIDのTODOを取得
- `createTodo(Todo todo)`：新しいTODOを作成
- `updateTodo(Long id, Todo todoDetails)`：既存のTODOを更新
- `deleteTodo(Long id)`：TODOを削除

### コントローラー（Controller）

`TodoController`クラスは、HTTPリクエストを処理し、適切なサービスメソッドを呼び出します：

- `GET /api/todos`：全てのTODOを取得
- `GET /api/todos/{id}`：指定されたIDのTODOを取得
- `POST /api/todos`：新しいTODOを作成
- `PUT /api/todos/{id}`：既存のTODOを更新
- `DELETE /api/todos/{id}`：TODOを削除

### 例外処理（Exception Handling）

`GlobalExceptionHandler`クラスは、アプリケーション全体の例外を処理し、適切なエラーレスポンスを返します：

- バリデーションエラー（MethodArgumentNotValidException）
- その他の予期しない例外（Exception）

### データ初期化（Data Initialization）

`DataInitializer`クラスは、アプリケーション起動時にテスト用のTODOデータをデータベースに投入します。

## フロントエンドコンポーネント

フロントエンドは、ReactとTypeScriptを使用したシングルページアプリケーション（SPA）として実装されています。主要なコンポーネントは以下の通りです：

### カスタムフック（Custom Hook）

`useTodos`フックは、TODOリストの状態管理とAPIとの通信を行います：

- `todos`：TODOリストの状態
- `loading`：データ読み込み中かどうかを示すフラグ
- `error`：エラーメッセージ
- `fetchTodos()`：APIからTODOリストを取得
- `addTodo(title)`：新しいTODOを追加
- `toggleTodoComplete(id, currentCompletedStatus)`：TODOの完了状態を切り替え
- `deleteTodo(id)`：TODOを削除

### コンポーネント（Components）

- `TodoList`：TODOリストを表示するコンポーネント
- `TodoItem`：個々のTODOアイテムを表示するコンポーネント
- `AddTodoForm`：新しいTODOを追加するためのフォームコンポーネント

## アプリケーションの実行方法

### Dockerを使用する場合

1. リポジトリをクローンします：
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. Docker Composeを使用してアプリケーションを起動します：
   ```bash
   docker-compose up
   ```

3. ブラウザで以下のURLにアクセスします：
   ```
   http://localhost:3000
   ```

### ローカルで実行する場合

#### バックエンド

1. バックエンドディレクトリに移動します：
   ```bash
   cd backend
   ```

2. Mavenを使用してアプリケーションをビルドします：
   ```bash
   ./mvnw clean package
   ```

3. アプリケーションを実行します：
   ```bash
   ./mvnw spring-boot:run
   ```

4. バックエンドサーバーは以下のURLで実行されます：
   ```
   http://localhost:8080
   ```

#### フロントエンド

1. フロントエンドディレクトリに移動します：
   ```bash
   cd frontend
   ```

2. 依存関係をインストールします：
   ```bash
   npm install
   ```

3. 開発サーバーを起動します：
   ```bash
   npm start
   ```

4. フロントエンドアプリケーションは以下のURLで実行されます：
   ```
   http://localhost:3000
   ```

## APIエンドポイント

バックエンドAPIは以下のエンドポイントを提供します：

### TODOの取得

- **URL**: `/api/todos`
- **メソッド**: GET
- **説明**: 全てのTODOアイテムを取得します
- **レスポンス**: TODOアイテムの配列
  ```json
  [
    {
      "id": 1,
      "title": "牛乳を買う",
      "completed": false
    },
    {
      "id": 2,
      "title": "Spring Bootの勉強をする",
      "completed": true
    }
  ]
  ```

### 特定のTODOの取得

- **URL**: `/api/todos/{id}`
- **メソッド**: GET
- **説明**: 指定されたIDのTODOアイテムを取得します
- **パラメータ**: `id` - TODOのID
- **レスポンス**: TODOアイテム
  ```json
  {
    "id": 1,
    "title": "牛乳を買う",
    "completed": false
  }
  ```

### 新しいTODOの作成

- **URL**: `/api/todos`
- **メソッド**: POST
- **説明**: 新しいTODOアイテムを作成します
- **リクエストボディ**:
  ```json
  {
    "title": "新しいTODO",
    "completed": false
  }
  ```
- **レスポンス**: 作成されたTODOアイテム
  ```json
  {
    "id": 3,
    "title": "新しいTODO",
    "completed": false
  }
  ```

### TODOの更新

- **URL**: `/api/todos/{id}`
- **メソッド**: PUT
- **説明**: 既存のTODOアイテムを更新します
- **パラメータ**: `id` - 更新するTODOのID
- **リクエストボディ**:
  ```json
  {
    "title": "更新されたTODO",
    "completed": true
  }
  ```
- **レスポンス**: 更新されたTODOアイテム
  ```json
  {
    "id": 1,
    "title": "更新されたTODO",
    "completed": true
  }
  ```

### TODOの削除

- **URL**: `/api/todos/{id}`
- **メソッド**: DELETE
- **説明**: 指定されたIDのTODOアイテムを削除します
- **パラメータ**: `id` - 削除するTODOのID
- **レスポンス**: 204 No Content（成功時）