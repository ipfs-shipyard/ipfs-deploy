const { existsSync } = require('fs')
const ora = require('ora')
const chalk = require('chalk')
const _ = require('lodash')
const fp = require('lodash/fp')

const white = chalk.whiteBright

function guessedPath () {
  const guesses = [
    '_site', // jekyll, hakyll, eleventy
    'site', // forgot which
    'public', // gatsby, hugo
    'dist', // nuxt
    'output', // pelican
    'out', // hexo
    'build', // create-react-app, metalsmith, middleman
    'website/build', // docusaurus
    'docs' // many others
  ]

  return fp.filter(existsSync)(guesses)[0]
}

module.exports = publicPath => {
  let result
  const spinner = ora()

  if (_.isEmpty(publicPath)) {
    spinner.info(
      `🤔  No ${white('path')} argument specified. Looking for common ones…`
    )
    result = guessedPath()
    if (result) {
      spinner.succeed(
        `📂  Found local ${chalk.blue(result)} directory. Deploying that.`
      )
      return result
    } else {
      spinner.fail(
        `🔮  Couldn't guess what to deploy. Please specify a ${white('path')}.`
      )
      return undefined
    }
  } else {
    return publicPath
  }
}
