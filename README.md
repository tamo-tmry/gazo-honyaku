# 画像翻訳機
## 概要
このプロジェクトは、画像アップロード、画像内テキストのOCRによる抽出、そしてGPT-4を使用したテキストの翻訳機能を備えています。  
ユーザーは画像をアップロードし、その画像からテキストを抽出し、翻訳することができます。

## 機能
- 画像のアップロードとBase64形式への変換
- OpenAIのOCRモデルを使用した画像内テキストの抽出
- GPT-4を使用したテキストの翻訳

## 始め方
このプロジェクトをローカルで実行するには、以下の手順に従ってください。

### 必要条件
- Node.js
- yarn

### インストール
リポジトリをクローンします。

```bash
git clone git@github.com:tamo-tmry/gazo-honyaku.git
```

依存関係をインストールします。
```bash
yarn install
```

### 環境設定
.env ファイルをプロジェクトのルートに作成し、以下のように設定します。

```.env
OPENAI_API_KEY=OpenAI APIキー
OCR_PROMPT=OCR用のプロンプト
TRANSLATE_PROMPT=翻訳用のプロンプト
```

### 実行
アプリケーションをローカルで実行します。

```bash
yarn dev
```

### 使用技術
- Vue.js(Nuxt.js v3)
- TypeScript
- OpenAI API
