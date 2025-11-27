import * as core from '@actions/core';

export interface ActionInputs {
  readonly owner: string;
  readonly repo: string;
  readonly baseBranch: string;
  readonly newBranch: string;
  readonly githubToken: string;
}

export class ConfigManager {
  static getInputs(): ActionInputs {
    const inputs: ActionInputs = {
      owner: core.getInput('owner', { required: true }).trim(),
      repo: core.getInput('repo', { required: true }).trim(),
      baseBranch: core.getInput('base-branch', { required: true }).trim(),
      newBranch: core.getInput('new-branch', { required: true }).trim(),
      githubToken: core.getInput('github-token', { required: true }).trim(),
    };

    this.validate(inputs);
    return inputs;
  }

  private static validate(inputs: ActionInputs): void {
    const { owner, repo, baseBranch, newBranch, githubToken } = inputs;

    if (!owner || !repo || !baseBranch || !newBranch || !githubToken) {
      throw new Error('All inputs are required and cannot be empty.');
    }

    const branchRegex = /^[a-zA-Z0-9-_./]+$/;
    if (!branchRegex.test(newBranch)) {
      throw new Error(`Invalid branch name format: '${newBranch}'.`);
    }

    if (baseBranch === newBranch) {
      throw new Error(`The new branch ('${newBranch}') must be different from the base branch.`);
    }
  }
}
