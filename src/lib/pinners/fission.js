const axios = require('axios')
const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const fp = require('lodash/fp')

const BASE_URL = 'https://runfission.com/ipfs'
const headers = { 'content-type': 'application/octet-stream' }

const uploadFile = async (auth, filepath) => {
  const resp = await axios.post(BASE_URL, fs.createReadStream(filepath), {
    maxContentLength: 'Infinity',
    auth,
    headers
  })
  return resp.data
}

const putDAGObj = async (auth, node) => {
  const resp = await axios.post(`${BASE_URL}/dag`, JSON.stringify(node), {
    auth,
    headers
  })
  return resp.data
}

const walk = async (auth, dir) => {
  dir = path.normalize(dir)

  if (!fs.statSync(dir).isDirectory()) {
    return uploadFile(auth, dir)
  }

  const files = fs.readdirSync(dir)
  const links = await Promise.all(
    files.map(async file => {
      const filepath = path.join(dir, file)
      const stat = fs.statSync(filepath)
      const cid = await walk(auth, filepath)
      return {
        Name: file,
        Size: stat.size,
        CID: {
          '/': cid
        }
      }
    })
  )
  const node = {
    data: 'CAE=',
    links
  }
  return putDAGObj(auth, node)
}

module.exports = {
  name: 'Fission',
  builder: async ({ username, password }) => {
    if (fp.some(_.isEmpty)([username, password])) {
      throw new Error(`Missing the following environment variables:

IPFS_DEPLOY_FISSION__USERNAME
IPFS_DEPLOY_FISSION__PASSWORD `)
    }

    return { username, password }
  },
  pinDir: walk,
  pinHash: async (auth, hash) => {
    return axios.put(`${BASE_URL}/${hash}`, {}, { auth })
  }
}
