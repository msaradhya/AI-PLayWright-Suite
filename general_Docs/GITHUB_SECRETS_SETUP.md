# GitHub Secrets Setup for UIHN Playwright QA Automation

## Required Secrets for GitHub Actions Workflow

To ensure the GitHub Actions workflow runs successfully, you need to configure the following secrets in your GitHub repository:

### Navigation to Secrets:
1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### Required Secrets:

#### 1. GitHub Personal Access Token (Critical for Framework Access)
**Name:** `GH_PAT`
**Description:** Personal Access Token with repository access permissions
**Required Permissions:**
- `repo` (Full control of private repositories)
- `read:org` (Read organization membership)

**How to Create:**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with the permissions above
3. Copy the token and add it as `GH_PAT` secret

#### 2. Optional Secrets (for full functionality):
- `SLACK_BOT_BEARER_TOKEN` - For Slack notifications
- `AZURE_LOG_STORAGE_TOKEN` - For Azure log storage
- `JIRA_USER` - For JIRA integration
- `JIRA_PASSWORD` - For JIRA integration  
- `ZEPHYR_SHARED_SECRET` - For Zephyr test management
- `ZEPHYR_ISSUER` - For Zephyr test management
- `ZEPHYR_ACCOUNT_ID` - For Zephyr test management

## Fallback Mechanism

If `GH_PAT` is not available, the workflow will attempt to use the default `GITHUB_TOKEN`. However, the default token may not have sufficient permissions to access the private `powerschool-llc/refarch-playwright-quickstart` repository.

## Troubleshooting

If you see errors like:
- "fatal: could not read Username for 'https://github.com': terminal prompts disabled"
- "The process '/usr/bin/git' failed with exit code 128"

This indicates that the GitHub token doesn't have sufficient permissions to access the framework repository. Make sure to:

1. Create a Personal Access Token with `repo` permissions
2. Add it as the `GH_PAT` secret
3. Ensure the token is from a user who has access to the `powerschool-llc/refarch-playwright-quickstart` repository

## Workflow Features

The updated workflow includes:
- ✅ Fallback mechanisms for missing framework repository
- ✅ Configuration file copying from parent directory
- ✅ Public npm registry usage (no Artifactory authentication needed)
- ✅ Smart dependency caching
- ✅ Comprehensive error handling
- ✅ Continue-on-error for framework checkout failures