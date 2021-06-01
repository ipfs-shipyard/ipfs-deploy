const neatFrame = require('neat-frame')
const ora = require('ora')
const { stripIndent } = require('common-tags')
const isString = require('lodash.isstring')
const isError = require('lodash.iserror')
const isObjectLike = require('lodash.isobjectlike')

function formatError (e) {
  let eStr

  const beautifyStr = str => neatFrame(stripIndent(str), { trim: false })

  if (isError(e)) {
    eStr = e.toString()
  } else if (isString(e)) {
    eStr = e
  } else if (isObjectLike(e)) {
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
