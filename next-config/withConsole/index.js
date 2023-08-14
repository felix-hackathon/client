const intercept = require('intercept-stdout')
const withConsole = (config) => {
  intercept((text) => {
    if (text.includes('Fast Refresh had to perform a full reload')) {
      return ''
    } else if (text.includes('Buffer() is deprecated due to security and usability issues.')) {
      return ''
    }

    return text
  })
  return config
}

module.exports = withConsole
