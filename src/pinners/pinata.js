const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')
const recursive = require('recursive-fs')
const ora = require('ora')
const chalk = require('chalk')

const { logError } = require('../logging')
const { linkCid } = require('../utils/pure-fns')

const white = chalk.whiteBright

module.exports = ({ apiKey, secretApiKey }) => {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS'

  // we gather the files from a local directory in this example, but a valid
  // readStream is all that's needed for each file in the directory.
  return async (publicDirPath, pinataMetadata = {}) => {
    const spinner = ora()
    spinner.start(
      `📠  Uploading and pinning via https to ${white('pinata.cloud')}…`
    )

    try {
      const response = await new Promise(resolve => {
        recursive.readdirr(publicDirPath, (_err, _dirs, files) => {
          const data = new FormData()
          files.forEach(file => {
            data.append('file', fs.createReadStream(file), {
              // for each file stream, we need to include the correct
              // relative file path
              filepath: file,
            })
          })

          const metadata = JSON.stringify(pinataMetadata)
          data.append('pinataMetadata', metadata)

          axios
            .post(url, data, {
              // Infinity is needed to prevent axios from erroring out with
              // large directories
              maxContentLength: 'Infinity',
              headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: apiKey,
                pinata_secret_api_key: secretApiKey,
              },
            })
            .then(resolve)
        })
      })

      spinner.succeed("📌  It's pinned to Pinata now with hash:")
      const pinnedHash = response.data.IpfsHash
      spinner.info(linkCid(pinnedHash, 'infura'))
      return pinnedHash
    } catch (e) {
      spinner.fail("💔  Uploading to Pinata didn't work.")
      logError(e)
      return undefined
    }
  }
}
