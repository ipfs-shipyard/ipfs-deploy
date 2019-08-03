const ora = require('ora')
const chalk = require('chalk')
const { logError } = require('../logging')
const white = chalk.whiteBright

const makeDnslink = ({ name, validate, link }) => async (
  domain,
  hash,
  options
) => {
  const spinner = ora()

  try {
    spinner.start(`⚙️  Validating configuration for ${white(name)}…`)
    await validate(options)
  } catch (error) {
    spinner.fail(`💔  Missing arguments for ${white(name)} API.`)
    logError(error)
  }

  spinner.info(`📡  Beaming new hash to DNS provider ${white(name)}…`)
  let result = null

  try {
    const { record, value } = await link(domain, hash, options)
    spinner.succeed('🙌  SUCCESS!')
    spinner.info(`🔄  Updated DNS TXT ${white(record)} to:`)
    spinner.info(`🔗  ${white(value)}`)

    result = record
      .split('.')
      .slice(1)
      .join('.')
  } catch (error) {
    spinner.fail(`💔  Updating ${name} DNS didn't work.`)
    logError(error)
  }

  return result
}

module.exports = {
  cloudflare: makeDnslink(require('./cloudflare')),
}
