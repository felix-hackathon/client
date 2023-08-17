export const klaytnTestnet = {
  id: 1001,
  name: 'Klaytn Testnet',
  network: 'klaytn-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Klaytn',
    symbol: 'KLAY',
  },
  rpcUrls: {
    public: {
      http: ['https://public-en-baobab.klaytn.net'],
    },
    default: {
      http: ['https://public-en-baobab.klaytn.net'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Klaytn Testnet',
      url: 'https://baobab.klaytnfinder.io/',
    },
  },
  testnet: true,
}

export const klaytn = {
  id: 8217,
  name: 'Klaytn',
  network: 'klaytn',
  nativeCurrency: {
    decimals: 18,
    name: 'Klaytn',
    symbol: 'KLAY',
  },
  rpcUrls: {
    public: {
      http: ['https://public-en-cypress.klaytn.net'],
    },
    default: {
      http: ['https://public-en-cypress.klaytn.net'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Klaytn',
      url: 'https://www.klaytnfinder.io',
    },
  },
}

export const CHAINS = [klaytnTestnet, klaytn]
