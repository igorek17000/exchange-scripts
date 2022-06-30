export const accountBalance = (type: string, currency: string, data: any[]) => {
  const values = data.filter((item) => item.type === type).filter((item) => item.currency === currency.toLocaleUpperCase())
  if (values.length === 1) {
    return Number(values[0].available)
  }
  return 0
}

export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
