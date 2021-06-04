const { existsSync } = require('fs')
const trammel = require('trammel')
const byteSize = require('byte-size')
const terminalLink = require('terminal-link')
const colors = require('colors/safe')

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
 * @returns {string}
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
  return `🔗  ${colors.green(terminalLink(title, link))}`
}

/**
 * Get the gateway URL for a certain CID and origin.
 *
 * @param {string} cid
 * @param {string} origin
 * @returns {string}
 */
function gatewayUrl (cid, origin) {
  if (!origin) {
    throw new Error('no origin provided')
  }

  if (!cid) {
    throw new Error('no cid provided')
  }

  return cid ? `${origin}/ipfs/${cid}/` : origin
}

module.exports = {
  guessPath,
  getReadableSize,
  gatewayUrl,
  terminalUrl
}
