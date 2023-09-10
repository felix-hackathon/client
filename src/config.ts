const AppConfig = {
  appMode: process.env.NEXT_PUBLIC_APP_MODE || '',
  chainId: parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN || ''),
  apiUri: process.env.NEXT_PUBLIC_API_URI || '',
  registryAddress: '0x02101dfB77FDE026414827Fdc604ddAF224F0921' as `0x${string}`,
  implementationAddress: '0x2298edBc3ccF222B579FECd4E2fd701B88f1E56D' as `0x${string}`,
  carAddress: '0x191EC8e3F3cb12a87F33aA9582886C424446A775' as `0x${string}`,
  colorAddress: '0x1e1523E8773330573bD24D647f1dbB785Cc29DfF' as `0x${string}`,
  caliperAddress: '0x1ee9272895812f6743F2800502f8313BEa30E96a' as `0x${string}`,
  rimAddress: '0xe3f6f301ef6a7b54Ec2Ef8e91EA7ea549f519dfC' as `0x${string}`,
  brakeDiskAddress: '0x36A3879C06989785E6C0610EB17eaaDE6c445697' as `0x${string}`,
  windShieldAddress: '0xFD7c1F58868088212c3368320c9ced36236C39c6' as `0x${string}`,
  paymentGateway: '0xc08F3a36D2F0609012530011D3c14a4E1cCeC05b' as `0x${string}`,
  exchangeRouter: '0x5867c40175a45b080abad03f19131cfa9569287b' as `0x${string}`,
}

export default AppConfig
