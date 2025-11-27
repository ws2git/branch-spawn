import * as core from '@actions/core';
import { ConfigManager } from './config';
import { GitHubService } from './services/github.service';

/**
 * Main asynchronous function.
 * @returns {Promise<void>}
 */
async function run(): Promise<void> {
  try {
    core.info('-> Initializing action...');
    
    const inputs = ConfigManager.getInputs();
    core.info('✅ Inputs validated.');

    const gitService = new GitHubService(inputs.githubToken);

    core.info(`-> Fetching SHA for base branch: ${inputs.baseBranch}`);
    const sha = await gitService.getBranchSha(inputs.owner, inputs.repo, inputs.baseBranch);
    
    core.info(`-> Creating branch: ${inputs.newBranch}`);
    await gitService.createBranch(inputs.owner, inputs.repo, inputs.newBranch, sha);

    core.setOutput('success-message', `Branch '${inputs.newBranch}' created successfully.`);
    core.info('✅ Operation completed successfully!');

  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(`Action failed due to error: ${error.message}`);
    } else {
      core.setFailed('Action failed with an unknown error.');
    }
  }
}

void run();
