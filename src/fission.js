const axios = require('axios')
const fs = require('fs')
const path = require('path')
const ora = require('ora')

const { logError } = require('./logging')
const { linkCid } = require('./utils/pure-fns')

const chalk = require('chalk')
const white = chalk.whiteBright

module.exports.setupFission = ({ username, password }) => {
  const url = 'https://runfission.com/ipfs'

  return async publicDirPath => {
    const spinner = ora()
    spinner.start(
      `📠  Uploading and pinning via https to ${white('fission.codes')}…`
    )
    if (!username || !password) {
      spinner.fail("💔 Can't upload without Fission credentials")
      return undefined
    }

    const auth = { username, password }
    const headers = { 'content-type': 'application/octet-stream' }

    const uploadFile = async filepath => {
      const resp = await axios.post(url, fs.createReadStream(filepath), {
        auth,
        headers,
      })
      return resp.data
    }

    const putDAGObj = async node => {
      const resp = await axios.post(`${url}/dag`, JSON.stringify(node), {
        auth,
        headers,
      })
      return resp.data
    }

    const walk = async dir => {
      if (!fs.statSync(dir).isDirectory()) {
        return uploadFile(dir)
      }

      const files = fs.readdirSync(dir)
      const links = await Promise.all(
        files.map(async file => {
          const filepath = path.join(dir, file)
          const stat = fs.statSync(filepath)
          let cid = await walk(filepath)
          return {
            Name: file,
            Size: stat.size,
            CID: {
              '/': cid,
            },
          }
        })
      )
      const node = {
        data: 'CAE=',
        links,
      }
      return putDAGObj(node)
    }

    try {
      const pinnedHash = await walk(publicDirPath)
      spinner.succeed("📌  It's pinned to Fission now with hash:")
      spinner.info(linkCid(pinnedHash, 'fission'))
      return pinnedHash
    } catch (e) {
      spinner.fail("💔  Uploading to Fission didn't work.")
      logError(e)
      return undefined
    }
  }
}
