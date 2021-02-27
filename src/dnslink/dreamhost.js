const DreamHost = require('dreamhost')
const _ = require('lodash')
const fp = require('lodash/fp')

module.exports = {
  name: 'DreamHost',
  validate: ({ key, record } = {}) => {
    if (_.isEmpty(key)) {
      throw new Error(`Missing the following environment variables:

IPFS_DEPLOY_DREAMHOST__KEY`)
    }

    if (_.isEmpty(record)) {
      throw new Error(`Missing the following environment variables:
  
IPFS_DEPLOY_DREAMHOST__RECORD`)
    }
  },
  link: async (_domain, hash, { key, record }) => {
    const link = `/ipfs/${hash}`;

    const options = {
        type: 'TXT',
        record: record,
        value: link,
        comment: 'Added by ipfs-deploy.',
    };
    const dreamHost = new DreamHost({ key });
    const records = await dreamHost.dns.listRecords();
    const forDomain = _.filter(records, (o) => {
        return (o.record == options.record
                && o.type == options.type
                && o.value.startsWith('/ipfs/'));
    });
    _.each(forDomain, async (o) => {
        await dreamHost.dns.removeRecord({
            type: o.type,
            record: o.record,
            value: o.value
        });
    });

    // Sometimes the deletes take a little while to settle.
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            dreamHost.dns
                .addRecord(options)
                .then(() => {
                    resolve({
                        record: record,
                        value: options.value
                    });
                })
                .catch(reject);
        }, 100);
    });

  }
}
