const hasRightFormat = (obj) => {
  return typeof obj === 'object' &&
    typeof obj.name === 'string' &&
    typeof obj.builder === 'function' &&
    typeof obj.pinDir === 'function' &&
    typeof obj.pinHash === 'function'
}

module.exports = {
  hasRightFormat
}
