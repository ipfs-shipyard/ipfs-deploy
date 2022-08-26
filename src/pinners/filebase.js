'use strict'

const isEmpty = require('lodash.isempty')
const { FilebaseClient } = require('@filebase/client')
const { filesFromPath } = require('files-from-path')
const {default: axios} = require('axios')

/**
 * @typedef {import('./types').FilebaseOptions} FilebaseOptions
 * @typedef {import('./types').PinDirOptions} PinDirOptions
 */

const PIN_HASH_URL = 'https://api.filebase.io/v1/ipfs/pins'

class Filebase {
  /**
   * @param {FilebaseOptions} options
   */
  constructor ({ apiKey, secretApiKey, bucket}) {
    if ([apiKey, secretApiKey, bucket].some(isEmpty)) {
      throw new Error('apiKey and secretApiKey are required for Pinata')
    }

    this.auth = {
      api_key: apiKey,
      secret_api_key: secretApiKey,
      bucket: bucket
    }

    this.tokenString = btoa(`${this.auth.api_key}:${this.auth.secret_api_key}:${this.auth.bucket}`);
  }

  /**
   * @param {string} dir
   * @param {PinDirOptions|undefined} options
   * @returns {Promise<string>}
   */
  async pinDir (dir, { tag, hidden = false } = {}) {
    const files = []
    for await (const file of filesFromPath(dir, { pathPrefix: dir })) {
      files.push(file)
    }

    const cid = await FilebaseClient.storeDirectory(
      { endpoint: 'https://s3.filebase.com', token: this.tokenString },
      files,
      tag
    )

    return cid
  }

  /**
   * @param {string} cid
   * @param {string|undefined} tag
   * @returns {Promise<void>}
   */
  async pinCid (cid, tag) {
    const body = JSON.stringify({
      cid: cid,
      name: tag
    })

    const config = {
      headers: {
        Authorization: `Bearer ${this.tokenString}`,
        'Content-Type': 'application/json'
      }
    }

    await axios.post(PIN_HASH_URL, body, config)
  }

  /**
   * @param {string} cid
   * @returns string
   */
  gatewayUrl (cid) {
    return `https://ipfs.filebase.io/ipfs/${cid}`
  }

  static get displayName () {
    return 'Filebase'
  }

  get displayName () {
    return Filebase.displayName
  }

  static get slug () {
    return 'filebase'
  }
}

module.exports = Filebase
