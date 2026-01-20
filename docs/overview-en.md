# Product Overview

[日本語](overview.md) | English

## Purpose

To provide a playground for testing and demonstrating GPT-Image-1.5's image editing capabilities. Verify editing results using combinations of reference images and prompts, and conduct highly reproducible experiments using prompt templates.

## Target Users

- Product/design teams who want to verify image editing prompts
- Developers who want to check the behavior of the Image Edit API on Azure AI Foundry
- Personnel who want to compare editing results using reference images and mask images

## Key Features

- Upload reference images and mask images
- Specify image editing options (size, quality, input fidelity, output format, compression, background, etc.)
- Display generated results in a list and enlarged view
- Load template library
- Simple authentication (Cookie-based)

## Out of Scope

- Advanced user management or permission control implementation
- Persistent storage of edit history
- UI display for streaming output

## Screen Structure

- Home (/): Overview and navigation
- Playground (/items): Image editing input and result display
- About (/about): Usage guide
- Settings (/settings): Environment variable information
- Login (/login): Simple authentication

## Architecture Overview

- Frontend: Next.js App Router + Tailwind CSS
- Backend: Next.js API Routes
- External Service: Azure AI Foundry (Azure OpenAI Image Edit API)
- Authentication: Username/password configured in environment variables + Cookie

## Data Flow (Overview)

1. User inputs form data
2. Frontend sends FormData to /api/image-edit
3. API calls Azure OpenAI Image Edit API
4. Display returned base64 images in UI

## Dependencies

- @azure/identity: Azure AD token acquisition
- zod / dotenv: Environment variable validation
- Next.js / React / Tailwind CSS
