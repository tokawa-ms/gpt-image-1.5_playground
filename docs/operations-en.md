# Operations & Deployment

[日本語](operations.md) | English

## Environment Variables

Required:

- AZURE_OPENAI_ENDPOINT
- AZURE_OPENAI_DEPLOYMENT_NAME
- OPENAI_API_VERSION
- AUTH_USERNAME
- AUTH_PASSWORD

Optional:

- AZURE_OPENAI_API_KEY (if not using Managed Identity)
- PROMPT_TEMPLATES_DIR
- APPLICATIONINSIGHTS_CONNECTION_STRING
- PORT
- NODE_ENV

## Authentication

- Uses simple authentication (Cookie)
- Fails at startup if not configured

## Azure Authentication

- Local: Assumes Azure CLI login with DefaultAzureCredential
- Production (ACA): Managed Identity recommended
- If API Key is set, uses api-key

## Deployment (ACA Overview)

1. Deploy GPT-Image-1.5 in Azure AI Foundry
2. Push image to ACR
3. Create Azure Container Apps and enable Managed Identity
4. Set environment variables
5. Grant Managed Identity access to Azure OpenAI

## Logging/Monitoring

- Outputs console.error on API errors
- Set connection string to enable Application Insights

## Troubleshooting

- 401: Login session invalid. Re-login at /login
- 500: Check if environment variables are missing
- 429/5xx: Wait for retry as retry implementation exists
