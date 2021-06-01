const ora = require('ora')
const chalk = require('chalk')
const { logError } = require('../logging')

module.exports = ({ name, validate, link }) => async (
  domain,
  hash,
  options
) => {
  name = chalk.whiteBright(name)
  const spinner = ora()

  try {
    spinner.start(`⚙️  Validating configuration for ${name}…`)
    await validate(options)
  } catch (error) {
    spinner.fail(`💔  Missing arguments for ${name} API.`)
    logError(error)
    return
  }

  spinner.info(`📡  Beaming new hash to DNS provider ${name}…`)

  try {
    const { record, value } = await link(domain, hash, options)
    spinner.succeed('🙌  SUCCESS!')
    spinner.info(`🔄  Updated DNS TXT ${chalk.whiteBright(record)} to:`)
    spinner.info(`🔗  ${chalk.whiteBright(value)}`)

    return record
      .split('.')
      .slice(1)
      .join('.')
  } catch (error) {
    spinner.fail(`💔  Updating ${name} DNS didn't work.`)
    logError(error)
  }
}
