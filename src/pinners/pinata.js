const axios = require('axios')
const FormData = require('form-data')
const path = require('path')
const isEmpty = require('lodash.isempty')
const { globSource } = require('ipfs-http-client')

const MAX_RETRIES = 3
const RETRY_CODES = [429]
const PIN_DIR_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
const PIN_HASH_URL = 'https://api.pinata.cloud/pinning/pinHashToIPFS'

module.exports = {
  name: 'Pinata',
  builder: async ({ apiKey, secretApiKey }) => {
    if ([apiKey, secretApiKey].some(isEmpty)) {
      throw new Error(`Missing the following environment variables:

IPFS_DEPLOY_PINATA__API_KEY
IPFS_DEPLOY_PINATA__SECRET_API_KEY`)
    }

    return { apiKey, secretApiKey }
  },
  pinDir: async ({ apiKey, secretApiKey }, dir, tag) => {
    dir = path.normalize(dir)

    const data = new FormData()

    for await (const file of globSource(dir, { recursive: true })) {
      if (file.content) {
        data.append('file', file.content, {
          filepath: path.normalize(file.path)
        })
      }
    }

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
              pinata_api_key: apiKey,
              pinata_secret_api_key: secretApiKey
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
  },
  pinHash: async ({ apiKey, secretApiKey }, hash, tag) => {
    return axios.post(
      PIN_HASH_URL,
      JSON.stringify({
        hashToPin: hash,
        pinataMetadata: {
          name: tag
        }
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretApiKey
        }
      }
    )
  }
}
