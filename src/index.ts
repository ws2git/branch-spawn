import * as core from '@actions/core';
import * as github from '@actions/github';

/**
 * Main asynchronous function.
 * @returns {Promise<void>}
 */
async function run(): Promise<void> {
  try {
	const githubToken: string = core.getInput('github-token', { required: true }).trim();
    const owner: string = core.getInput('owner', { required: true }).trim();
    const repo: string = core.getInput('repo', { required: true }).trim();
    const baseBranch: string = core.getInput('base-branch', { required: true }).trim();
    const newBranch: string = core.getInput('new-branch', { required: true }).trim();
    
    const octokit = github.getOctokit(githubToken);
    
    core.info(`-> Trying to get the SHA for the base branch: ${baseBranch}`);
    
    const { data: baseBranchData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`, // 'heads/' é necessário para referências de branches
    });

    const sha = baseBranchData.object.sha;
    
    core.info(`<- SHA of the base branch (${baseBranch}) successfully obtained: ${sha}`);
    core.info(`-> Creating the new branch: ${newBranch} with SHA: ${sha}`);
    
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranch}`, // 'refs/heads/' é necessário para criar novas branches
      sha: sha,
    });

    core.setOutput('success-message', `Branch '${newBranch}' created successfully in the repository '${owner}/${repo}' from '${baseBranch}'.`);
    core.info('Operation completed successfully!');

  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(`Action failed due to error: ${error.message}`);
    } else {
      core.setFailed('Action failed with an unknown error.');
    }
  }
}

void run();
