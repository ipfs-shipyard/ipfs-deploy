'use strict'

const axios = require('axios')
const fs = require('fs')
const isEmpty = require('lodash.isempty')
const path = require('path')

const BASE_URL = 'https://runfission.com/ipfs'
const headers = { 'content-type': 'application/octet-stream' }

const putDAGObj = async (auth, node) => {
  const resp = await axios.post(`${BASE_URL}/dag`, JSON.stringify(node), {
    auth,
    headers
  })
  return resp.data
}

class Fission {
  constructor ({ username, password } = {}) {
    if ([username, password].some(isEmpty)) {
      throw new Error('username and password are required for Fission')
    }

    this.auth = {
      username,
      password
    }
  }

  async pinDir (dir, tag) {
    const files = fs.readdirSync(dir)
    const links = await Promise.all(
      files.map(async file => {
        const filepath = path.join(dir, file)
        const stat = fs.statSync(filepath)
        const cid = await this.walk(filepath, tag)
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

    return putDAGObj(this.auth, node)
  }

  async pinCid (cid, tag) {
    await axios.put(`${BASE_URL}/${cid}`, {}, { auth: this.auth })
  }

  gatewayUrl (cid) {
    return `https://ipfs.runfission.com/ipfs/${cid}`
  }

  static get displayName () {
    return 'Fission'
  }

  static get slug () {
    return 'fission'
  }
}

module.exports = Fission
