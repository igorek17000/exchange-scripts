import Decimal from "decimal.js"
import symbolsData from "./symbols.json"

const CAPITAL = 2000
const RISK_PERC = 0.01

export const main = (market: string) => {
  const symbolData = symbolsData.data.filter((item) => item.symbol == market)
  console.log(symbolData)

  const config = setConfig()

  // check min order amount
  // check enableTrading

  printMessage(config)
  return 2001
}

const setConfig = () => {
  const quoteAsset = "TEL"
  const entryPrice = 0.00165533
  const stopLossPrice = 0.00157421
  const riskAmount = new Decimal(RISK_PERC).mul(CAPITAL)
  const numberOfTokens = riskAmount.dividedBy(new Decimal(entryPrice).minus(stopLossPrice)).round()
  const entryPriceTotal = new Decimal(numberOfTokens).mul(entryPrice)
  const stopLossTotal = new Decimal(numberOfTokens).mul(stopLossPrice)
  const lossTotal = entryPriceTotal.minus(stopLossTotal)
  const lossPerc = lossTotal.div(entryPriceTotal).mul(100).toFixed(2)
  const targetPrice = 0.00180241
  const targetPriceTotal = numberOfTokens.mul(targetPrice)
  const profitTotal = targetPriceTotal.minus(entryPriceTotal)
  const profitPerc = profitTotal.div(entryPriceTotal).mul(100).toFixed(2)
  const riskRewardRatio = profitTotal.div(riskAmount)

  return {
    capital: CAPITAL,
    riskPerc: RISK_PERC,
    quoteAsset,
    entryPrice,
    stopLossPrice,
    riskAmount,
    numberOfTokens,
    entryPriceTotal,
    stopLossTotal,
    lossTotal,
    lossPerc,
    targetPriceTotal,
    profitTotal,
    profitPerc,
    riskRewardRatio,
  }
}

const printMessage = (config: any) => {
  const message = `Capital: ${config.capital}
Risk Percent: ${config.riskPerc}
Quote Asset: ${config.quoteAsset}
Entry Price: ${config.entryPrice}
Stop Loss price: ${config.stopLossPrice}
Risk Amount: ${config.riskAmount}
Number of Tokens: ${config.numberOfTokens}
Entry Price Total: ${config.entryPriceTotal}
Stop Loss Total: ${config.stopLossTotal}
Loss Total: ${config.lossTotal}
Loss Percent: ${config.lossPerc}
Target Price Total: ${config.targetPriceTotal}
Profit Total: ${config.profitTotal}
Profit Percent: ${config.profitPerc}
Risk Reward Ration: 1:${config.riskRewardRatio}
  `

  console.log(message)
}
