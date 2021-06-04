'use strict'

const { default: axios } = require('axios')
const isEmpty = require('lodash.isempty')
const { getDirFormData } = require('./utils')

/**
 * @typedef {import('./types').PinataOptions} PinataOptions
 * @typedef {import('./types').PinDirOptions} PinDirOptions
 */

const MAX_RETRIES = 3
const RETRY_CODES = [429]
const PIN_DIR_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
const PIN_HASH_URL = 'https://api.pinata.cloud/pinning/pinByHash'

class Pinata {
  /**
   * @param {PinataOptions} options
   */
  constructor ({ apiKey, secretApiKey }) {
    if ([apiKey, secretApiKey].some(isEmpty)) {
      throw new Error('apiKey and secretApiKey are required for Pinata')
    }

    this.auth = {
      pinata_api_key: apiKey,
      pinata_secret_api_key: secretApiKey
    }
  }

  /**
   * @param {string} dir
   * @param {PinDirOptions|undefined} options
   * @returns {Promise<string>}
   */
  async pinDir (dir, { tag, hidden = false } = {}) {
    const data = await getDirFormData(dir, hidden)
    const metadata = JSON.stringify({ name: tag })
    data.append('pinataMetadata', metadata)

    let retries = 0
    let lastErrorCode = -1

    while (retries < MAX_RETRIES) {
      try {
        const res = await axios
          .post(PIN_DIR_URL, data, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
              'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`,
              ...this.auth
            }
          })

        return res.data.IpfsHash
      } catch (err) {
        if (err && err.response && RETRY_CODES.includes(err.response.status)) {
          retries += 1
          lastErrorCode = err.response.status
        } else {
          throw err
        }
      }
    }

    throw new Error(`Max retries exceeded. (${lastErrorCode})`)
  }

  /**
   * @param {string} cid
   * @param {string|undefined} tag
   * @returns {Promise<void>}
   */
  async pinCid (cid, tag) {
    const body = JSON.stringify({
      hashToPin: cid,
      pinataMetadata: {
        name: tag
      }
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.auth
      }
    }

    await axios.post(PIN_HASH_URL, body, config)
  }

  /**
   * @param {string} cid
   * @returns string
   */
  gatewayUrl (cid) {
    return `https://gateway.pinata.cloud/ipfs/${cid}`
  }

  static get displayName () {
    return 'Pinata'
  }

  get displayName () {
    return Pinata.displayName
  }

  static get slug () {
    return 'pinata'
  }
}

module.exports = Pinata
