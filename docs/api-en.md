# API Specification

[日本語](api.md) | English

## Common

- Base URL: /api
- Authentication: Cookie (simple_auth)
- On failure, returns JSON with message

## GET /api/health

- Purpose: Health check
- Response: { "status": "ok", "timestamp": "ISO string" }

## POST /api/auth/login

- Purpose: Simple authentication login
- Request (JSON):
  - username: string
  - password: string
- Success: 200, { "ok": true } + Cookie set
- Failure: 401

## POST /api/auth/logout

- Purpose: Logout
- Success: 200, { "ok": true } + Cookie destroyed

## GET /api/templates

- Purpose: Get template list
- Response: [{ "name": "templateName" }, ...]

## GET /api/templates/{name}

- Purpose: Get template content
- Response: { "name": "templateName", "content": "..." }
- Failure: 404

## POST /api/image-edit

- Purpose: Execute image editing
- Format: multipart/form-data
- Required Fields:
  - image: File
  - prompt: string
  - size: 1024x1024 | 1024x1536 | 1536x1024
  - quality: low | medium | high
  - n: 1-10
- Optional Fields:
  - mask: File
  - model: string (default gpt-image-1.5)
  - user: string
  - input_fidelity: low | medium | high
  - output_format: png | jpeg
  - output_compression: 0-100
  - background: string
  - stream: boolean (string "true" / "false")
  - partial_images: number (only when stream=true)

### Response

- Success: Returns Azure OpenAI response as-is
- Failure: 4xx/5xx with message

### Validation

- Validates size / quality / output_format / input_fidelity
- Returns 400 if image is not specified
