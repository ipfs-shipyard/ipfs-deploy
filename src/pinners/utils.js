'use strict'

const FormData = require('form-data')
const path = require('path')
const { globSource } = require('ipfs-http-client')

async function getDirFormData (dir) {
  const data = new FormData()

  for await (const file of globSource(dir, { recursive: true })) {
    if (file.content) {
      data.append('file', file.content, {
        filepath: path.normalize(file.path)
      })
    }
  }

  return data
}

module.exports = {
  getDirFormData
}
