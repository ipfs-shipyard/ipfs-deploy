const ora = require('ora')
const isString = require('lodash.isstring')
const isError = require('lodash.iserror')
const isObjectLike = require('lodash.isobjectlike')
const indentString = require('indent-string')

function formatError (e) {
  let eStr

  if (isError(e)) {
    eStr = e.toString()
  } else if (isString(e)) {
    eStr = e
  } else if (isObjectLike(e)) {
    eStr = JSON.stringify(e, null, '  ')
  }

  return '\n' + indentString(eStr, 2) + '\n'
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

module.exports = { logError, logger }
