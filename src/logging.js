const _ = require('lodash')
const fp = require('lodash/fp')
const neatFrame = require('neat-frame')
const ora = require('ora')
const { stripIndent } = require('common-tags')

function formatError (e) {
  let eStr

  const beautifyStr = fp.pipe(
    stripIndent,
    str => neatFrame(str, { trim: false })
  )

  if (_.isError(e)) {
    eStr = e.toString()
  } else if (_.isString(e)) {
    eStr = e
  } else if (_.isObjectLike(e)) {
    eStr = JSON.stringify(e, null, '  ')
  }
  const beautifulErrorString = '\n' + beautifyStr(eStr)
  return beautifulErrorString
}

function logError (e) {
  const errorString = formatError(e)
  console.error(errorString)
  return errorString
}

const logger = (options) => {
  if (!(options.writeError && options.writeLog)) {
    return ora()
  }

  const stderr = options.writeError ? options.writeError : logError
  const stdout = options.writeLog

  return {
    fail: stderr,
    succeed: stdout,
    info: stdout,
    start: stdout
  }
}

module.exports = { formatError, logError, logger }
