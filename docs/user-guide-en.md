# User Guide

[日本語](user-guide.md) | English

## Pre-startup Preparation

1. Copy .env.template to .env.local
2. Set required environment variables
3. npm install / npm run dev

## Image Editing Flow

1. Access /login and log in with the username and password from environment variables
2. Upload a reference image (PNG/JPG) on /items
3. Add a mask image (PNG) as needed
4. Enter a prompt (you can also load templates)
5. Configure image editing options
6. Press "Execute Image Edit" and check the results

## How to Use Templates

- Place .txt files under the prompt-templates directory
- The filename (excluding extension) will be displayed as the template name
- Select a template and press "Load" to reflect it in the input field

## Meaning of Key Options

- Size: 1024x1024 / 1024x1536 / 1536x1024
- Quality: low / medium / high
- Input Fidelity: low / medium / high
- Output Format: png / jpeg
- Output Compression: 0-100 (effective for JPEG)
- Background: Example: transparent
- User ID: Arbitrary string for auditing

## Generated Results

- Results are displayed with newest on top
- Click on an image to enlarge

## Common Errors

- Reference image not selected: Error displayed on form
- Authentication error: Redirect to /login or 401
- Missing environment variables: Exception at startup

## Limitations

- Persistent storage of generated results is not implemented
- UI display for streaming responses is not implemented
