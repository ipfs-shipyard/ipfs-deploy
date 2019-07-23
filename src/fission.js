const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')
const recursive = require('recursive-fs')
const ora = require('ora')

const { logError } = require('./logging')
const { linkCid } = require('./utils/pure-fns')

const chalk = require('chalk')
const white = chalk.whiteBright

module.exports.setupFission = ({ apiKey, secretApiKey }) => {
  const url = 'https://hostless.dev/ipfs'

  // we gather the files from a local directory in this example, but a valid
  // readStream is all that's needed for each file in the directory.
  return async (publicDirPath /*, fissionMetadata = {}*/) => {
    const spinner = ora()
    spinner.start(
      `📠  Uploading and pinning via https to ${white('fission.codes')}…`
    )

    try {
      const response = await new Promise(resolve => {
        recursive.readdirr(publicDirPath, (_err, _dirs, files) => {
          let data = new FormData()
          files.forEach(file => {
            data.append('file', fs.createReadStream(file), {
              // for each file stream, we need to include the correct
              // relative file path
              filepath: file,
            })
          })

          // const metadata = JSON.stringify(fissionMetadata)
          // data.append('fissionMetadata', metadata)

          // var basicAuth = 'Basic ' + btoa(apiKey + ':' + secretApiKey);
          var basicAuth = new Buffer(apiKey + ':' + secretApiKey).toString(
            'base64'
          )

          axios
            .post(url, data, {
              // Infinity is needed to prevent axios from erroring out with
              // large directories
              maxContentLength: 'Infinity',
              /*

              // Looking at: https://stackoverflow.com/questions/44072750/how-to-send-basic-auth-with-axios
               
              auth: {
                username: apiKey,
                password: secretApiKey,
              }, */
              headers: {
                Authorization: basicAuth,
                'Content-Type': 'application/octet-stream',
              },
            })
            .then(resolve)
        })
      })

      spinner.succeed("📌  It's pinned to FISSION now with hash:")
      const pinnedHash = response.data // response on success is the hash
      spinner.info(linkCid(pinnedHash, 'infura'))
      return pinnedHash
    } catch (e) {
      spinner.fail("💔  Uploading to FISSION didn't work.")
      logError(e)
      return undefined
    }
  }
}
