const _ = require('lodash')
const fp = require('lodash/fp')
const stringify = require('json-stringify-safe')
const prettier = require('prettier')
const jsonifyError = require('jsonify-error')
const neatFrame = require('neat-frame')
const { stripIndent } = require('common-tags')

// # Pure functions

function formatError(e) {
  let eStr
  const prettierJson = obj =>
    prettier.format(stringify(obj), {
      parser: 'json',
      printWidth: 72,
      tabWidth: 2,
    })
  const beautifyStr = fp.pipe(
    stripIndent,
    str => neatFrame(str, { trim: false })
  )
  if (_.isError(e)) {
    eStr = prettierJson(jsonifyError(e))
  } else if (_.isString(e)) {
    eStr = e
  } else if (_.isObjectLike(e)) {
    eStr = prettierJson(e)
  }
  const beautifulErrorString = '\n' + beautifyStr(eStr)
  return beautifulErrorString
}

// Effectful functions

function logError(e) {
  const errorString = formatError(e)
  console.error(errorString)
  return errorString
}

module.exports = { formatError, logError }
