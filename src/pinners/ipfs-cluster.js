'use strict'

const { default: axios } = require('axios')
const path = require('path')
const isEmpty = require('lodash.isempty')
const { getDirFormData } = require('./utils')

/**
 * @typedef {import('./types').IPFSClusterOptions} IPFSClusterOptions
 */

class IpfsCluster {
  /**
   *
   * @param {IPFSClusterOptions} options
   */
  constructor ({ host, username, password }) {
    if ([host, username, password].some(isEmpty)) {
      throw new Error('host, username and password are required for IPFS Cluster')
    }

    this.host = host
    this.headers = {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
    }
  }

  /**
   * @param {string} dir
   * @param {string|undefined} tag
   * @returns {Promise<string>}
   */
  async pinDir (dir, tag) {
    const data = await getDirFormData(dir)

    const res = await axios
      .post(`${this.host}/add?name=${tag}`, data, {
        maxContentLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`,
          ...this.headers
        }
      })

    // Results should be new-line delimited JSON.
    const results = res.data
      .trim()
      .split('\n')
      .map(JSON.parse)

    const basename = path.basename(dir)
    // @ts-ignore
    const root = results.find(({ name }) => name === basename)

    return root.cid['/']
  }

  /**
   * @param {string} cid
   * @param {string|undefined} tag
   * @returns {Promise<void>}
   */
  async pinCid (cid, tag) {
    await axios
      .post(`${this.host}/pins/${cid}?name=${tag}`, null, {
        headers: this.headers
      })
  }

  /**
   * @param {string} cid
   * @returns string
   */
  gatewayUrl (cid) {
    return `https://ipfs.io/ipfs/${cid}`
  }

  static get displayName () {
    return 'IPFS Cluster'
  }

  get displayName () {
    return IpfsCluster.displayName
  }

  static get slug () {
    return 'ipfs-cluster'
  }
}

module.exports = IpfsCluster
