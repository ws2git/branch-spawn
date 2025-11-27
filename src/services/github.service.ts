import * as github from '@actions/github';

type OctokitClient = ReturnType<typeof github.getOctokit>;

/**
 * GitHubService
 */
export class GitHubService {
  private octokit: OctokitClient;

  constructor(token: string) {
    this.octokit = github.getOctokit(token);
  }

  /**
   * getBranchSha
   */
  async getBranchSha(owner: string, repo: string, branch: string): Promise<string> {
    const { data } = await this.octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });
    return data.object.sha;
  }

  /**
   * createBranch
   */
  async createBranch(owner: string, repo: string, newBranch: string, sha: string): Promise<void> {
    await this.octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranch}`,
      sha,
    });
  }
}
