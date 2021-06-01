const hasRightFormat = (obj) => {
  return typeof obj === 'object' &&
    typeof obj.name === 'string' &&
    typeof obj.validate === 'function' &&
    typeof obj.link === 'function'
}

module.exports = {
  hasRightFormat
}
