import { existsSync } from 'node:fs'
// @ts-ignore
import trammel from 'trammel'
// @ts-ignore
import byteSize from 'byte-size'
import terminalLink from 'terminal-link'
import chalk from 'chalk'

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
export function guessPath () {
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
export async function getReadableSize (path) {
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
export function terminalUrl (title, link) {
  return `🔗  ${chalk.green(terminalLink(title, link))}`
}
