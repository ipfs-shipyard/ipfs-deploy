import FormData from 'form-data'
import { globSource } from 'ipfs-http-client'

/**
 * @param {string} dir
 * @param {boolean} hidden
 * @param {string} pathPrefix
 * @returns {Promise<FormData>}
 */
export async function getDirFormData (dir, hidden, pathPrefix = '') {
  const data = new FormData()

  for await (const file of globSource(dir, '**/*', { hidden })) {
    // @ts-ignore
    if (file.content) {
      // @ts-ignore
      data.append('file', file.content, {
        filepath: pathPrefix + file.path
      })
    }
  }

  return data
}
