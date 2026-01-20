# GPT-Image-1.5 Playground (Azure AI Foundry)

[日本語](README.md) | English

This is a playground application for editing reference images using GPT-Image-1.5 from Azure AI Foundry. It is built with Next.js (App Router) + TypeScript + Tailwind CSS and calls the Azure OpenAI Image Edit API via API routes.

## Main Features

- Image editing using reference images and mask images
- Key options for Image Edit API (size / quality / n / input_fidelity / output_format / output_compression / background)
- Template library (auto-load .txt files from prompt-templates directory)
- Simple authentication (Cookie-based) with /login page
- Health check API (/api/health)

## Documentation

- [docs/overview-en.md](docs/overview-en.md)
- [docs/user-guide-en.md](docs/user-guide-en.md)
- [docs/api-en.md](docs/api-en.md)
- [docs/operations-en.md](docs/operations-en.md)

## Local Execution

1. Install dependencies

```
npm install
```

2. Prepare environment variables

Copy `.env.template` to `.env.local` and set the values.

3. Start the development server

```
npm run dev
```

Open http://localhost:3000 in your browser.

## Page List

- / : Home
- /items : Image editing playground
- /about : Usage guide
- /settings : Environment variable information
- /login : Simple authentication login

## Running with Docker

```
docker build -t gpt-image-playground .
```

```
docker run -p 3000:3000 --env-file .env.local gpt-image-playground
```

## Deployment to Azure Container Apps (ACA) Overview

1. Prepare Azure OpenAI (Azure AI Foundry) resources and GPT-Image-1.5 model deployment.
2. Push the image to Azure Container Registry.
3. Create Azure Container Apps and enable Managed Identity.
4. Set `AZURE_OPENAI_ENDPOINT` / `AZURE_OPENAI_DEPLOYMENT_NAME` / `OPENAI_API_VERSION` in the app's environment variables.
5. Grant the Managed Identity access to Azure OpenAI.

## Environment Variables

| Variable                              | Required | Description                                    |
| ------------------------------------- | -------- | ---------------------------------------------- |
| PORT                                  | Optional | Container listening port (default 3000)        |
| NODE_ENV                              | Optional | `development` or `production`                  |
| AZURE_OPENAI_ENDPOINT                 | Required | Azure OpenAI resource endpoint                 |
| AZURE_OPENAI_DEPLOYMENT_NAME          | Required | GPT-Image-1.5 deployment name                  |
| OPENAI_API_VERSION                    | Required | Example: `2025-04-01-preview`                  |
| AZURE_OPENAI_API_KEY                  | Optional | Only required for key-based authentication     |
| PROMPT_TEMPLATES_DIR                  | Optional | Directory for storing templates                |
| APPLICATIONINSIGHTS_CONNECTION_STRING | Optional | For Application Insights                       |
| AUTH_USERNAME                         | Required | Username for simple authentication             |
| AUTH_PASSWORD                         | Required | Password for simple authentication             |

## About Simple Authentication

Simple authentication using `AUTH_USERNAME` / `AUTH_PASSWORD` configured in `.env.local`. Unauthenticated users are redirected to `/login`.

## Template Library

Place .txt files in the `prompt-templates` directory, and they will automatically appear in the template list on the Playground screen.

## References

- Azure OpenAI Image Generation/Edit: https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/dall-e?view=foundry-classic&tabs=gpt-image-1
- Azure OpenAI JavaScript Image Generation Sample: https://learn.microsoft.com/en-us/azure/ai-foundry/openai/dall-e-quickstart?pivots=programming-language-javascript#generate-images-with-dall-e
