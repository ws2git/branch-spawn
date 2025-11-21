import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    // 1. Obter os inputs
    const owner = core.getInput('owner', { required: true });
    const repo = core.getInput('repo', { required: true });
    const baseBranch = core.getInput('base-branch', { required: true });
    const newBranch = core.getInput('new-branch', { required: true });
    const githubToken = core.getInput('github-token', { required: true });

    // 2. Inicializar o cliente Octokit (para interagir com a API do GitHub)
    const octokit = github.getOctokit(githubToken);
    
    // 3. Obter o SHA do commit da base-branch
    core.info(`-> Trying to get the SHA for the base branch: ${baseBranch}`);
    const { data: baseBranchData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`, // 'heads/' é necessário para referências de branches
    });

    const sha = baseBranchData.object.sha;
    core.info(`<- SHA of the base branch (${baseBranch}) successfully obtained: ${sha}`);

    // 4. Criar a nova branch (referência)
    core.info(`-> Creating the new branch: ${newBranch} with SHA: ${sha}`);
    
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranch}`, // 'refs/heads/' é necessário para criar novas branches
      sha: sha,
    });

    // 5. Sucesso
    core.setOutput('success-message', `Branch '${newBranch}' created successfully in the repository '${owner}/${repo}' from '${baseBranch}'.`);
    core.info('Operation completed successfully!');

  } catch (error: any) {
    // 6. Falha
    core.setFailed(error.message);
    core.error(`Failed to create branch: ${error.message}`);
  }
}

// Executar a função principal
run();
