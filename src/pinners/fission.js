'use strict'

const { default: axios } = require('axios')
const fs = require('fs')
const isEmpty = require('lodash.isempty')
const path = require('path')

const BASE_URL = 'https://runfission.com/ipfs'
const headers = { 'content-type': 'application/octet-stream' }

/**
 * @typedef {import('./types').FissionOptions} FissionOptions
 */

/**
 * @param {FissionOptions} auth
 * @param {Object} node
 * @returns {Promise<string>}
 */
const putDAGObj = async (auth, node) => {
  const resp = await axios.post(`${BASE_URL}/dag`, JSON.stringify(node), {
    auth,
    headers
  })
  return resp.data
}

/**
 * @param {FissionOptions} auth
 * @param {string} filepath
 * @returns
 */
const uploadFile = async (auth, filepath) => {
  const resp = await axios.post(BASE_URL, fs.createReadStream(filepath), {
    // @ts-ignore
    maxContentLength: 'Infinity',
    auth,
    headers
  })
  return resp.data
}

class Fission {
  /**
   * @param {FissionOptions} options
   */
  constructor ({ username, password }) {
    if ([username, password].some(isEmpty)) {
      throw new Error('username and password are required for Fission')
    }

    this.auth = {
      username,
      password
    }
  }

  /**
   * @param {string} dir
   * @param {string|undefined} tag
   * @returns {Promise<string>}
   */
  async pinDir (dir, tag) {
    if (!fs.statSync(dir).isDirectory()) {
      return uploadFile(this.auth, dir)
    }

    const files = fs.readdirSync(dir)
    const links = await Promise.all(
      files.map(async file => {
        const filepath = path.join(dir, file)
        const stat = fs.statSync(filepath)
        const cid = await this.pinDir(filepath, tag)
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

  /**
   * @param {string} cid
   * @param {string|undefined} tag
   * @returns {Promise<void>}
   */
  async pinCid (cid, tag) {
    await axios.put(`${BASE_URL}/${cid}`, {}, { auth: this.auth })
  }

  /**
   * @param {string} cid
   * @returns string
   */
  gatewayUrl (cid) {
    return `https://ipfs.runfission.com/ipfs/${cid}`
  }

  static get displayName () {
    return 'Fission'
  }

  get displayName () {
    return Fission.displayName
  }

  static get slug () {
    return 'fission'
  }
}

module.exports = Fission
