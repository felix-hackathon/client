import BigNumber from 'bignumber.js'

export const calculateNumber = (
  number1: number | string | bigint,
  number2: number | string | bigint,
  method: 'plus' | 'times' | 'minus' | 'div' | 'pow',
  resultType: 'string' | 'number' = 'string'
) => {
  const BN1 = BigNumber(number1.toString())
  const BN2 = BigNumber(number2.toString())
  if (method === 'div' && BN2.isLessThan(0)) {
    throw new Error('Supper math error div by zero')
  }
  if (resultType === 'number') {
    return BN1[method](BN2).toNumber()
  }
  return BN1[method](BN2).toFixed()
}

export const convertBalanceToWei = (balance: number | string, decimals = 18) => {
  return calculateNumber(balance, calculateNumber(10, decimals, 'pow', 'string'), 'times', 'string').toString().split('.')[0]
}

export const convertWeiToBalance = (balanceWei: string | bigint, decimals = 18) => {
  return calculateNumber(balanceWei, calculateNumber(10, decimals, 'pow', 'string'), 'div', 'number')
}

export const roundingNumber = (number: string | number | bigint, rounding = 8) => {
  const powNumber = Math.pow(10, rounding)
  return Math.floor(BigNumber(number.toString()).times(BigNumber(powNumber)).toNumber()) / powNumber
}
