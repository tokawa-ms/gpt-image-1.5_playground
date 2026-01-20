# GPT-Image-1.5 Playground (Azure AI Foundry)

日本語 | [English](README-en.md)

Azure AI Foundry の GPT-Image-1.5 を使って、参照画像の編集を行うプレイグラウンドアプリです。Next.js (App Router) + TypeScript + Tailwind CSS で構成され、API ルート経由で Azure OpenAI 画像編集 API を呼び出します。

## 主な機能

- 参照画像とマスク画像を使った画像編集
- 画像編集 API の主要オプション（size / quality / n / input_fidelity / output_format / output_compression / background）
- テンプレートライブラリ（prompt-templates ディレクトリの .txt を自動読み込み）
- 簡易認証（Cookie ベース）と /login 画面
- ヘルスチェック API（/api/health）

## ドキュメント

- [docs/overview.md](docs/overview.md)
- [docs/user-guide.md](docs/user-guide.md)
- [docs/api.md](docs/api.md)
- [docs/operations.md](docs/operations.md)

## ローカル実行

1. 依存関係のインストール

```
npm install
```

2. 環境変数を準備

`.env.template` を `.env.local` にコピーし、値を設定します。

3. 開発サーバーの起動

```
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## 画面一覧

- / : ホーム
- /items : 画像編集プレイグラウンド
- /about : 使い方
- /settings : 環境変数の案内
- /login : 簡易認証ログイン

## Docker で実行

```
docker build -t gpt-image-playground .
```

```
docker run -p 3000:3000 --env-file .env.local gpt-image-playground
```

## Azure Container Apps (ACA) へのデプロイ概要

1. Azure OpenAI (Azure AI Foundry) リソースと GPT-Image-1.5 モデルデプロイを準備します。
2. Azure Container Registry にイメージをプッシュします。
3. Azure Container Apps を作成し、Managed Identity を有効化します。
4. アプリの環境変数に `AZURE_OPENAI_ENDPOINT` / `AZURE_OPENAI_DEPLOYMENT_NAME` / `OPENAI_API_VERSION` を設定します。
5. Managed Identity に Azure OpenAI へのアクセス権を付与します。

## 環境変数

| 変数                                  | 必須 | 説明                                  |
| ------------------------------------- | ---- | ------------------------------------- |
| PORT                                  | 任意 | コンテナの待受ポート (既定 3000)      |
| NODE_ENV                              | 任意 | `development` または `production`     |
| AZURE_OPENAI_ENDPOINT                 | 必須 | Azure OpenAI リソースのエンドポイント |
| AZURE_OPENAI_DEPLOYMENT_NAME          | 必須 | GPT-Image-1.5 のデプロイ名            |
| OPENAI_API_VERSION                    | 必須 | 例: `2025-04-01-preview`              |
| AZURE_OPENAI_API_KEY                  | 任意 | キーベース認証が必要な場合のみ        |
| PROMPT_TEMPLATES_DIR                  | 任意 | テンプレートの保存ディレクトリ        |
| APPLICATIONINSIGHTS_CONNECTION_STRING | 任意 | Application Insights 用               |
| AUTH_USERNAME                         | 必須 | 簡易認証のユーザー名                  |
| AUTH_PASSWORD                         | 必須 | 簡易認証のパスワード                  |

## 簡易認証について

`.env.local` に設定した `AUTH_USERNAME` / `AUTH_PASSWORD` を使用した簡易認証を提供します。未認証の場合は `/login` にリダイレクトされます。

## テンプレートライブラリ

`prompt-templates` ディレクトリに .txt ファイルを配置すると、Playground 画面のテンプレート一覧に自動で表示されます。

## 参照

- Azure OpenAI 画像生成/編集: https://learn.microsoft.com/ja-jp/azure/ai-foundry/openai/how-to/dall-e?view=foundry-classic&tabs=gpt-image-1
- Azure OpenAI JavaScript 画像生成サンプル: https://learn.microsoft.com/en-us/azure/ai-foundry/openai/dall-e-quickstart?pivots=programming-language-javascript#generate-images-with-dall-e
