const make = require('./maker')

module.exports = {
  cloudflare: make(require('./cloudflare'))
}
