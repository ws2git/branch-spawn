# Branch Spawn

A specialized GitHub Action that creates a new branch in a specified repository, based on an existing branch.
This GitHub Action is useful for teams who want to **automate the creation of feature, hotfix, or release branches** as part of a Continuous Integration process, especially when the target repository is different from the one running the workflow.

---

## ✨ Features

- **Branch Creation Automation**: Programmatically creates a new Git branch based on a specified source branch.
- **Cross-Repository Support**: Can operate on any repository for which the provided GitHub Token has the necessary permissions.
- **Secure API Interaction**: Uses the official **GitHub Octokit client** (Node.js) for secure interaction with the GitHub Git Data API.
- **Simple Integration**: One-step usage in any workflow.


## 🛠️ Usage

### 1. **Prerequisites**

- Your workflow **must pass all required inputs** to this action (`owner`, `repo`, `base-branch`, `new-branch`).
- The action requires a **GitHub Token** with `write` permissions for the repository's `contents`. For creating branches in the current repository, `${{ github.token }}` usually suffices if the job has explicit `contents: write` permissions. For external repositories, a **PAT** (Personal Access Token) is often required.

### 2. **Example Workflow Integration**

```yaml
name: Spawn New Release Branch

on:
  workflow_dispatch # Manually trigger the branch creation

jobs:
  create_branch:
    runs-on: ubuntu-latest
    permissions:
      # **ATTENTION**: The token needs 'contents: write' permissions.
      contents: write # Required for creating branches/references
    steps:
      - name: Create 'release/v1.2.0' branch from 'main'
        uses: ws2git/branch-spawn@v1
        with:
          # **ADJUST INPUTS HERE**
          owner: ${{ github.repository_owner }} # Or a specific organization/user name
          repo: ${{ github.event.repository.name }} # Or a specific repository name
          base-branch: main
          new-branch: release/v1.2.0
          github-token: ${{ github.token }} # Use the default token (or a PAT secret for cross-repo access)
````

## 📥 Inputs

| Name | Required | Description |
|---|---|---|
| `owner` | Yes | The owner (user or organization) of the repository where the branch will be created. |
| `repo` | Yes | The name of the target repository. |
| `base-branch` | Yes | The existing branch name to create the new branch from (e.g., `main` or `develop`). |
| `new-branch` | Yes | The name of the new branch to be created (e.g., `feature/my-task`). |
| `github-token` | Yes | The GitHub Token with `contents: write` permissions for the target repository. |

## ⚙️ How It Works

Internally, this action runs a Node.js script using the official **GitHub Octokit client** to interact with the Git Data API.

**Octokit Logic (High Level):**

1.  **Get Base Branch SHA**: Calls `octokit.rest.git.getRef` for `refs/heads/${base-branch}` to retrieve the SHA of the latest commit on the source branch.
2.  **Create New Reference**: Calls `octokit.rest.git.createRef` using the retrieved SHA to create a new reference (branch) at `refs/heads/${new-branch}`.
3.  **Output**: Sets an output `success-message` upon successful creation.

If any required parameter is missing or the token lacks the necessary permissions, the action will fail and exit with an error.

## 🛡️ Security and Authentication

This Action requires a **GitHub Token** to authenticate with the GitHub API via Octokit. This token must have the **`contents: write`** permission on the target repository to create a new reference (branch).

**Recommended for the current repository**: Use the default token **`${{ github.token }}`** combined with explicit job permissions:

```yaml
permissions:
  contents: write

# ...

  with:
    github-token: ${{ github.token }}
```

**Advanced Operations/External Repositories**: If you need to create a branch in a repository *different* from the one running the workflow, or if `contents: write` is not sufficient, pass a **PAT** (Personal Access Token) stored as a **Secret**:

```yaml
  with:
    github-token: ${{ secrets.MY_PAT_SECRET }}
```

**Never expose the PAT in plain text.**

## 📌 Notes

⚠️ **Attention: Token and Permissions**

  - Always ensure the token passed via the `github-token` input has the appropriate **write** permissions for the **target repository** defined by the `owner` and `repo` inputs.
  - For cross-repository operations, a **Personal Access Token (PAT)** is typically necessary, as `${{ github.token }}` is limited to the repository where the workflow is running.

## 🔗 Related Documentation

- [GitHub Actions Contexts](https://docs.github.com/en/actions/learn-github-actions/contexts)
- [Managing Git references (API Documentation)](https://docs.github.com/en/rest/git/refs?apiVersion=2022-11-28)


## ❓ Support

If you find a bug or have a question, [open an issue](https://github.com/ws2git/branch-spawn/issues).
