# API 仕様

日本語 | [English](api-en.md)

## 共通

- ベース URL: /api
- 認証: Cookie（simple_auth）
- 失敗時は JSON で message を返す

## GET /api/health

- 目的: ヘルスチェック
- レスポンス: { "status": "ok", "timestamp": "ISO文字列" }

## POST /api/auth/login

- 目的: 簡易認証ログイン
- リクエスト (JSON):
  - username: string
  - password: string
- 成功: 200, { "ok": true } + Cookie 設定
- 失敗: 401

## POST /api/auth/logout

- 目的: ログアウト
- 成功: 200, { "ok": true } + Cookie 破棄

## GET /api/templates

- 目的: テンプレート一覧取得
- レスポンス: [{ "name": "templateName" }, ...]

## GET /api/templates/{name}

- 目的: テンプレート内容取得
- レスポンス: { "name": "templateName", "content": "..." }
- 失敗: 404

## POST /api/image-edit

- 目的: 画像編集の実行
- 形式: multipart/form-data
- 必須フィールド:
  - image: File
  - prompt: string
  - size: 1024x1024 | 1024x1536 | 1536x1024
  - quality: low | medium | high
  - n: 1〜10
- 任意フィールド:
  - mask: File
  - model: string (既定 gpt-image-1.5)
  - user: string
  - input_fidelity: low | medium | high
  - output_format: png | jpeg
  - output_compression: 0〜100
  - background: string
  - stream: boolean (文字列 "true" / "false")
  - partial_images: number (stream=true の場合のみ)

### レスポンス

- 成功: Azure OpenAI のレスポンスをそのまま返却
- 失敗: 4xx/5xx と message

### バリデーション

- size / quality / output_format / input_fidelity を検証
- image 未指定の場合は 400
