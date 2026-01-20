# 運用・デプロイ

日本語 | [English](operations-en.md)

## 環境変数

必須:

- AZURE_OPENAI_ENDPOINT
- AZURE_OPENAI_DEPLOYMENT_NAME
- OPENAI_API_VERSION
- AUTH_USERNAME
- AUTH_PASSWORD

任意:

- AZURE_OPENAI_API_KEY（Managed Identity を使わない場合）
- PROMPT_TEMPLATES_DIR
- APPLICATIONINSIGHTS_CONNECTION_STRING
- PORT
- NODE_ENV

## 認証

- 簡易認証（Cookie）を使用
- 未設定の場合は起動時に失敗

## Azure 認証

- ローカル: Azure CLI ログインを前提に DefaultAzureCredential
- 本番 (ACA): Managed Identity を推奨
- API Key が設定されている場合は api-key を使用

## デプロイ（ACA 概要）

1. Azure AI Foundry で GPT-Image-1.5 をデプロイ
2. ACR にイメージを push
3. Azure Container Apps を作成し、Managed Identity を有効化
4. 環境変数を設定
5. Managed Identity に Azure OpenAI へのアクセス権を付与

## ロギング/監視

- API エラー時に console.error を出力
- Application Insights を有効化する場合は接続文字列を設定

## トラブルシューティング

- 401: ログインセッションが無効。/login で再ログイン
- 500: 環境変数が不足していないか確認
- 429/5xx: リトライ実装があるため再試行を待つ
