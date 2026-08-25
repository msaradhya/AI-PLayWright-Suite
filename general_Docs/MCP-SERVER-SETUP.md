# MCP Server Configuration

## Prerequisites
This project requires the following MCP (Model Context Protocol) servers to be configured for AI-assisted test development:

1. **Atlassian MCP Server** - For JIRA integration
2. **Playwright MCP Server** - For browser automation and UI discovery

## Setup Instructions

### Step 1: Locate MCP Configuration File
The MCP configuration file is located at:
- **macOS/Linux**: `~/Library/Application Support/Code/User/mcp.json`
- **Windows**: `%APPDATA%\Code\User\mcp.json`

### Step 2: Add Required MCP Servers
Copy the following configuration into your `mcp.json` file:

```json
{
    "servers": {
        "atlassian": {
            "type": "http",
            "url": "https://mcp.atlassian.com/v1/sse",
            "gallery": true,
            "version": "0.0.1"
        },
        "playwright": {
            "type": "stdio",
            "command": "npx",
            "args": [
                "@playwright/mcp@latest"
            ],
            "gallery": true,
            "version": "0.0.1"
        }
    },
    "inputs": []
}
```

### Step 3: Restart VS Code
After updating the `mcp.json` file:
1. Save the file
2. Restart VS Code to apply the changes
3. The MCP servers will be automatically loaded

## MCP Server Capabilities

### Atlassian MCP Server
- **Purpose**: Integration with JIRA for test case management
- **Features**:
  - Fetch test case details from JIRA tickets
  - Create and update test cases
  - Query test plans and requirements
  - Link test results to JIRA issues

### Playwright MCP Server
- **Purpose**: Browser automation and UI element discovery
- **Features**:
  - Navigate web pages and capture element selectors
  - Take screenshots and accessibility snapshots
  - Interact with UI elements (click, type, select)
  - Test interactive components and dynamic content
  - Identify stable locators for test automation

## Verification

To verify MCP servers are working:

1. **Check MCP Status**: Look for MCP server indicators in VS Code status bar
2. **Test Atlassian Connection**: Try fetching a JIRA ticket using the AI assistant
3. **Test Playwright Connection**: Request UI discovery for a web page

## Troubleshooting

### Atlassian MCP Server Issues
- **Authentication Required**: You may need to authenticate with Atlassian when first using the server
- **Connection Errors**: Verify your internet connection and proxy settings
- **Permission Issues**: Ensure you have access to the JIRA projects you're querying

### Playwright MCP Server Issues
- **npx Command Not Found**: Ensure Node.js and npm are installed and in your PATH
- **Version Conflicts**: Clear npm cache if experiencing version-related issues: `npm cache clean --force`
- **Browser Issues**: The MCP server will download required browsers on first use

## Additional Configuration (Optional)

### Environment Variables
You can set these environment variables for additional configuration:

```bash
# For Atlassian MCP
export ATLASSIAN_API_TOKEN="your-api-token"
export ATLASSIAN_EMAIL="your-email@example.com"

# For Playwright MCP
export PLAYWRIGHT_BROWSER="chromium"  # or "firefox", "webkit"
```

### Custom MCP Server Arguments
Modify the Playwright MCP server configuration to use specific browser:

```json
"playwright": {
    "type": "stdio",
    "command": "npx",
    "args": [
        "@playwright/mcp@latest",
        "--browser",
        "chromium"
    ],
    "gallery": true,
    "version": "0.0.1"
}
```

## Support

For MCP server issues:
- **Atlassian MCP**: https://mcp.atlassian.com/docs
- **Playwright MCP**: https://github.com/microsoft/playwright/tree/main/packages/mcp
- **General MCP Protocol**: https://modelcontextprotocol.io/

For project-specific issues, contact the QA automation team.
