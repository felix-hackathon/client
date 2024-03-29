const AppConfig = {
  appMode: process.env.NEXT_PUBLIC_APP_MODE || '',
  chainId: parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN || ''),
  apiUri: process.env.NEXT_PUBLIC_API_URI || '',
  registryAddress: '0x02101dfB77FDE026414827Fdc604ddAF224F0921' as `0x${string}`,
  implementationAddress: '0x2298edBc3ccF222B579FECd4E2fd701B88f1E56D' as `0x${string}`,
  carAddress: '0x191EC8e3F3cb12a87F33aA9582886C424446A775' as `0x${string}`,
  colorAddress: '0x7D9CFe680a4B2712E6F58cc7eb03Dd4AFf7F8DbB' as `0x${string}`,
  caliperAddress: '0xE96b1e0C5C89E29Fd2d764244eCF733402584723' as `0x${string}`,
  rimAddress: '0xF8955cD3aF87eB1fF5356337D27a4D762450Eb39' as `0x${string}`,
  brakeDiskAddress: '0xb7D35f901d254A94425B61E1728ed17b3FFCBb2F' as `0x${string}`,
  windShieldAddress: '0x1b34813c2dA391B97499a4dDa571621715966B9E' as `0x${string}`,
  paymentGateway: '0xD1a4d179A42523849D5710538B39d3FbBC1d81af' as `0x${string}`,
  exchangeRouter: '0x5867c40175a45b080abad03f19131cfa9569287b' as `0x${string}`,
  WKLAY: '0xbb3273dc4cac595afb93559c3aa07e9e6a554fc0' as `0x${string}`,
  usdtPair: '0xf1c961f001bd3f8278d4ec798b593f81c4e9851d' as `0x${string}`,
  usdcPair: '0x379dc1434af86a1a3800915caa84bc422ae490ca' as `0x${string}`,
}

export default AppConfig
