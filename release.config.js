module.exports = {
  ci: false,
  repositoryUrl: 'git@github.com:agentofuser/ipfs-deploy.git',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
    '@semantic-release/github',
  ],
}
