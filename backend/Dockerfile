# ステージ1: ビルド環境（バックエンド）
# アプリケーションのビルドに使用するベースイメージを指定します。
# eclipse-temurin:21-jdk-jammy は、Java 21 JDK を含む Ubuntu Jammy Jellyfish ベースのイメージです。
# "AS builder" により、このステージに "builder" という名前を付けています。これは後のステージで参照するために使用します。
FROM eclipse-temurin:21-jdk-jammy AS builder

# 作業ディレクトリを /app に設定します。
# これ以降の COPY, RUN, CMD, ENTRYPOINT などの命令は、このディレクトリを基準に実行されます。
WORKDIR /app

# Maven Wrapper の設定ファイル (.mvn ディレクトリ) をコンテナの /app/.mvn にコピーします。
# これにより、ホスト環境に Maven がインストールされていなくても、プロジェクトで定義されたバージョンの Maven を使用できます。
COPY .mvn/ .mvn

# Maven Wrapper の実行スクリプト (mvnw) とプロジェクトの定義ファイル (pom.xml) をコンテナの /app/ にコピーします。
COPY mvnw pom.xml ./

# Maven の依存関係をダウンロードします。
# "dependency:go-offline" ゴールは、プロジェクトの依存関係をローカルリポジトリにダウンロードし、オフラインでのビルドを可能にします。
# "-B" オプションは、バッチモードで実行し、インタラクティブな入力を無効にします。
RUN ./mvnw dependency:go-offline -B

# プロジェクトのソースコード (src ディレクトリ) をコンテナの /app/src にコピーします。
COPY src ./src

# Maven を使用してアプリケーションをパッケージ化します。
# "package" コマンドは、コンパイル、テストの実行（ここではスキップ）、JAR ファイルの作成などを行います。
# "-DskipTests" オプションは、テストの実行をスキップします。
# "-Pprod" オプションは、"prod" という名前のプロファイルをアクティブ化します。これは通常、本番環境向けのビルド設定を指定します。
RUN ./mvnw package -DskipTests -Pprod

# ステージ2: 実行環境（バックエンド）
# アプリケーションの実行に使用するベースイメージを指定します。
# eclipse-temurin:21-jre-jammy は、Java 21 JRE (Java Runtime Environment) を含む Ubuntu Jammy Jellyfish ベースのイメージです。
# JRE は JDK よりも軽量で、アプリケーションの実行に必要なコンポーネントのみを含みます。
FROM eclipse-temurin:21-jre-jammy

# 作業ディレクトリを /app に設定します。
WORKDIR /app

# ステージ1 (builder) でビルドされた JAR ファイルを、現在のステージの /app/app.jar にコピーします。
# "--from=builder" オプションは、前のステージ ("builder") からファイルをコピーすることを指定します。
# これにより、ビルド成果物のみを実行環境に含め、ビルドツールや中間ファイルを含まない軽量なイメージを作成できます (マルチステージビルド)。
COPY --from=builder /app/target/todo-api-0.0.1-SNAPSHOT.jar app.jar

# コンテナが実行時にリッスンするポートを指定します。
# この例では、ポート 8080 を公開します。これは、Spring Boot アプリケーションのデフォルトポートです。
# これはドキュメンテーションの目的であり、実際にポートを公開するには、`docker run` コマンドで `-p` または `-P` オプションを使用する必要があります。
EXPOSE 8080

# コンテナ起動時に実行されるコマンドを指定します。
# ここでは、`java -jar app.jar` コマンドを実行して、コピーされた JAR ファイルを起動します。
# これにより、コンテナが起動するとすぐにアプリケーションが実行されます。
ENTRYPOINT ["java","-jar","app.jar"]