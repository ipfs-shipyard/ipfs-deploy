'use strict'

const { existsSync } = require('fs')
// @ts-ignore
const trammel = require('trammel')
// @ts-ignore
const byteSize = require('byte-size')
const terminalLink = require('terminal-link')
const chalk = require('chalk')

const pathsToCheck = [
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

/**
 * Guess a contents path.
 *
 * @returns {string}
 */
function guessPath () {
  const guesses = pathsToCheck.filter(existsSync)
  if (guesses.length > 1) {
    throw new Error('more than one guessable path to deploy, please specify a path')
  }

  if (guesses.length === 0) {
    throw new Error('could not guess what to deploy, please specify a path')
  }

  return guesses[0]
}

/**
 * Display the size of the directory.
 *
 * @param {string} path
 * @returns {Promise<string>}
 */
async function getReadableSize (path) {
  const size = await trammel(path, {
    stopOnError: true,
    type: 'raw'
  })

  const kibi = byteSize(size, { units: 'iec' })
  const readableSize = `${kibi.value} ${kibi.unit}`
  return readableSize
}

/**
 * Get a link formatted to be printed in the terminal.
 *
 * @param {string} title
 * @param {string} link
 * @returns {string}
 */
function terminalUrl (title, link) {
  return `🔗  ${chalk.green(terminalLink(title, link))}`
}

module.exports = {
  guessPath,
  getReadableSize,
  terminalUrl
}
