const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')
const recursive = require('recursive-fs')
const _ = require('lodash')
const fp = require('lodash/fp')

const PIN_DIR_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
const PIN_HASH_URL = 'https://api.pinata.cloud/pinning/pinHashToIPFS'

module.exports = {
  name: 'Pinata',
  builder: async ({ apiKey, secretApiKey }) => {
    if (fp.some(_.isEmpty)([apiKey, secretApiKey])) {
      throw new Error(
        'IPFS_DEPLOY_PINATA__API_KEY and IPFS_DEPLOY_PINATA__SECRET_API_KEY must be set.'
      )
    }

    return { apiKey, secretApiKey }
  },
  pinDir: async ({ apiKey, secretApiKey }, dir, tag) => {
    const response = await new Promise(resolve => {
      recursive.readdirr(dir, (_err, _dirs, files) => {
        const data = new FormData()
        files.forEach(file => {
          data.append('file', fs.createReadStream(file), {
            // for each file stream, we need to include the correct
            // relative file path
            filepath: file
          })
        })

        const metadata = JSON.stringify({ name: tag })
        data.append('pinataMetadata', metadata)

        axios
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
          .then(resolve)
      })
    })

    return response.data.IpfsHash
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
