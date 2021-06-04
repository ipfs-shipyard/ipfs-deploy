const axios = require('axios')
const isEmpty = require('lodash.isempty')
const { getDirFormData } = require('./utils')

const MAX_RETRIES = 3
const RETRY_CODES = [429]
const PIN_DIR_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
const PIN_HASH_URL = 'https://api.pinata.cloud/pinning/pinByHash'

class Pinata {
  constructor ({ apiKey, secretApiKey }) {
    if ([apiKey, secretApiKey].some(isEmpty)) {
      throw new Error('apiKey and secretApiKey are required for Pinata')
    }

    this.auth = {
      pinata_api_key: apiKey,
      pinata_secret_api_key: secretApiKey
    }
  }

  async pinDir (dir, tag) {
    const data = await getDirFormData(dir)
    const metadata = JSON.stringify({ name: tag })
    data.append('pinataMetadata', metadata)

    let retries = 0
    let lastErrorCode = -1

    while (retries < MAX_RETRIES) {
      try {
        const res = await axios
          .post(PIN_DIR_URL, data, {
            // Infinity is needed to prevent axios from erroring out with
            // large directories
            maxContentLength: 'Infinity',
            headers: {
              'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
              ...this.auth
            }
          })

        return res.data.IpfsHash
      } catch (err) {
        if (err && err.response && RETRY_CODES.includes(err.response.status)) {
          retries += 1
          lastErrorCode = err.response.status
          continue
        } else {
          throw err
        }
      }
    }

    throw new Error(`Max retries exceeded. (${lastErrorCode})`)
  }

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

  gatewayUrl (cid) {
    return `https://gateway.pinata.cloud/ipfs/${cid}`
  }

  static get displayName () {
    return 'Pinata'
  }

  static get slug () {
    return 'pinata'
  }
}

module.exports = Pinata
