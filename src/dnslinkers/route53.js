// @ts-ignore

import { Route53Client, ChangeResourceRecordSetsCommand } from '@aws-sdk/client-route-53'
import isEmpty from 'lodash.isempty'
const TTL = 60

/**
 * @typedef {import('./types.js').DNSRecord} DNSRecord
 * @typedef {import('./types.js').Route53Options} Route53Options
 */

export default class Route53 {
  /**
   * @param {Route53Options} options
   */
  constructor ({ accessKeyId, secretAccessKey, region, hostedZoneId, record }) {
    if ([accessKeyId, secretAccessKey, region, hostedZoneId, record].every(isEmpty)) {
      throw new Error('accessKeyId, secretAccessKey, region, hostedZoneId and record are required for Route53')
    }

    this.accessKeyId = accessKeyId
    this.secretAccessKey = secretAccessKey
    this.region = region
    this.hostedZoneId = hostedZoneId
    this.record = record
  }

  /**
   * @param {string} cid
   * @returns {Promise<DNSRecord>}
   */
  async link (cid) {
    const credentials = {
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey
    }

    const txtValue = `dnslink=/ipfs/${cid}`
    const client = new Route53Client({ region: this.region, credentials })
    const command = new ChangeResourceRecordSetsCommand({
      HostedZoneId: this.hostedZoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: 'UPSERT',
            ResourceRecordSet: {
              Name: this.record,
              Type: 'TXT',
              TTL,
              ResourceRecords: [
                {
                  Value: `"${txtValue}"`
                }
              ]
            }
          }
        ]
      }
    })

    await client.send(command)

    return {
      record: this.record,
      value: txtValue
    }
  }

  static get displayName () {
    return 'Route53'
  }

  get displayName () {
    return Route53.displayName
  }

  static get slug () {
    return 'route53'
  }
}
