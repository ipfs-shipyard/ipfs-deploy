const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')
const recursive = require('recursive-fs')
const _ = require('lodash')
const path = require('path')
const fp = require('lodash/fp')

const MAX_RETRIES = 3
const RETRY_CODES = [429]
const PIN_DIR_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
const PIN_HASH_URL = 'https://api.pinata.cloud/pinning/pinHashToIPFS'

module.exports = {
  name: 'Pinata',
  builder: async ({ apiKey, secretApiKey }) => {
    if (fp.some(_.isEmpty)([apiKey, secretApiKey])) {
      throw new Error(`Missing the following environment variables:

IPFS_DEPLOY_PINATA__API_KEY
IPFS_DEPLOY_PINATA__SECRET_API_KEY`)
    }

    return { apiKey, secretApiKey }
  },
  pinDir: async ({ apiKey, secretApiKey }, dir, tag) => {
    dir = path.normalize(dir)

    const { dirs, files } = await recursive.read(dir)
    const data = new FormData()
    const toStrip = path.dirname(dir).length
    files.forEach(file => {
      file = path.normalize(file)
      data.append('file', fs.createReadStream(file), {
        // for each file stream, we need to include the correct
        // relative file path
        filepath: file.slice(toStrip)
      })
    })

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
