const { existsSync } = require('fs')
const ora = require('ora')
const chalk = require('chalk')
const isEmpty = require('lodash.isempty')

function guessedPath () {
  const guesses = [
    '_site', // jekyll, hakyll, eleventy
    'site', // forgot which
    'public', // gatsby, hugo, hexo
    'dist', // nuxt
    'output', // pelican
    'build', // create-react-app, metalsmith, middleman
    'website/build', // docusaurus
    'docs', // many others
    'out' // unknown others
  ]

  return guesses.filter(existsSync)[0]
}

module.exports = publicPath => {
  let result
  const spinner = ora()

  if (isEmpty(publicPath)) {
    spinner.info(`🤔  No ${chalk.whiteBright('path')} argument specified. Looking for common ones…`)
    result = guessedPath()
    if (result) {
      spinner.succeed(`📂  Found local ${chalk.blueBright(result)} directory. Deploying that.`)
      return result
    } else {
      spinner.fail(`🔮  Couldn't guess what to deploy. Please specify a ${chalk.whiteBright('path')}.`)
      return undefined
    }
  } else {
    return publicPath
  }
}
