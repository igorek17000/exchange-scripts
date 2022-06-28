import Decimal from "decimal.js"

export const positionSize = () => {
  const capital = 2000
  const riskPerc = 0.01
  const quoteAsset = "RUNE"
  const entryPrice = 1.95
  const stopLossPrice = 1.74
  const riskAmount = new Decimal(riskPerc).mul(capital)
  const numberOfTokens = riskAmount.dividedBy(new Decimal(entryPrice).minus(stopLossPrice)).round()
  const entryPriceTotal = new Decimal(numberOfTokens).mul(entryPrice)
  const stopLossTotal = new Decimal(numberOfTokens).mul(stopLossPrice)
  const lossTotal = entryPriceTotal.minus(stopLossTotal)
  const lossPerc = lossTotal.div(entryPriceTotal).mul(100).toFixed(2)
  const targetPrice = 2.43
  const targetPriceTotal = numberOfTokens.mul(targetPrice)
  const profitTotal = targetPriceTotal.minus(entryPriceTotal)
  const profitPerc = profitTotal.div(entryPriceTotal).mul(100).toFixed(2)
  const riskRewardRatio = profitTotal.div(riskAmount)

  const message = `Capital: ${capital}
Risk Percent: ${riskPerc}
Quote Asset: ${quoteAsset}
Entry Price: ${entryPrice}
Stop Loss price: ${stopLossPrice}
Risk Amount: ${riskAmount}
Number of Tokens: ${numberOfTokens}
Entry Price Total: ${entryPriceTotal}
Stop Loss Total: ${stopLossTotal}
Loss Total: ${lossTotal}
Loss Percent: ${lossPerc}
Target Price Total: ${targetPriceTotal}
Profit Total: ${profitTotal}
Profit Percent: ${profitPerc}
Risk Reward Ration: 1:${riskRewardRatio}
`

  console.log(message)

  return 2001
}
