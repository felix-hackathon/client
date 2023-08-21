const path = require('path')
const env = require(`./env.${process.env.TARGET_ENV || process.env.NODE_ENV}.json`)

const withConsole = require('./next-config/withConsole')
/** @type {import('next').NextConfig} */
let config = {
  env,
  swcMinify: true,
  cleanDistDir: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ['tokens.1inch.io', 'i.seadn.io'],
  },
}

let nextConfig = config

if (process.env.NODE_ENV === 'development') {
  nextConfig = withConsole({
    ...config,
  })
}
if (process.env.NODE_ENV === 'production') {
  const withPWANext = require('next-pwa')

  const withPWA = withPWANext({
    dest: 'public',
    buildExcludes: ['app-build-manifest.json'],
  })

  const generateAppDirEntry = (entry) => {
    const packagePath = require.resolve('next-pwa')
    const packageDirectory = path.dirname(packagePath)
    const registerJs = path.join(packageDirectory, 'register.js')

    return entry().then((entries) => {
      if (entries['main-app'] && !entries['main-app'].includes(registerJs)) {
        if (Array.isArray(entries['main-app'])) {
          entries['main-app'].unshift(registerJs)
        } else if (typeof entries['main-app'] === 'string') {
          entries['main-app'] = [registerJs, entries['main-app']]
        }
      }
      return entries
    })
  }

  nextConfig = withPWA({
    ...nextConfig,
    webpack: (config) => {
      const entry = generateAppDirEntry(config.entry)
      config.entry = () => entry
      return config
    },
  })
}

module.exports = nextConfig
