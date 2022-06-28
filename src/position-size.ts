import Decimal from "decimal.js"
import symbolsData from "./symbols.json"
import { countDecimals } from "./util"

const CAPITAL = 540
const RISK_PERC = 0.01

export const main = (market: string, entryPrice: number, stopLossPrice: number, targetPrice: number) => {
  try {
    const symbolData = symbolsData.data.filter((item) => item.symbol == market)
    if (symbolData.length !== 1) {
      throw new Error("Error ==> Cannot find exchnage symbol data: " + market)
    }
    // console.log(symbolData[0])

    if (!symbolData[0].enableTrading) {
      throw new Error("Error ==> Trading not enabled: " + market)
    }

    const config = setConfig(market, entryPrice, stopLossPrice, targetPrice, symbolData[0])

    // check min order amount

    printMessage(config)
    return 2001
  } catch (error) {
    console.log(error)
  }
}

const setConfig = (market: string, entryPrice: number, stopLossPrice: number, targetPrice: number, symbolData: any) => {
  // The size must be greater than the baseMinSize for the symbol and no larger than the baseMaxSize.
  // The size must be specified in baseIncrement symbol units.
  const minBaseOrderSize = new Decimal(symbolData.baseMinSize).mul(symbolData.baseIncrement)
  const quoteIncrementDecimals = countDecimals(symbolData.baseIncrement)
  // console.log(quoteIncrementDecimals)
  const riskAmount = new Decimal(RISK_PERC).mul(CAPITAL)
  const numberOfTokens = riskAmount.dividedBy(new Decimal(entryPrice).minus(stopLossPrice)).toFixed(quoteIncrementDecimals)
  const entryPriceTotal = new Decimal(numberOfTokens).mul(entryPrice)
  const stopLossTotal = new Decimal(numberOfTokens).mul(stopLossPrice)
  const lossTotal = entryPriceTotal.minus(stopLossTotal)
  const lossPerc = lossTotal.div(entryPriceTotal).mul(100).toFixed(2)
  const targetPriceTotal = new Decimal(numberOfTokens).mul(targetPrice).toFixed(2)
  const profitTotal = new Decimal(targetPriceTotal).minus(entryPriceTotal).toFixed(2)
  const profitPerc = new Decimal(profitTotal).div(entryPriceTotal).mul(100).toFixed(2)
  const riskRewardRatio = new Decimal(profitTotal).div(riskAmount).toFixed(2)

  // check Order size is above the minimum required
  if (entryPriceTotal < minBaseOrderSize) {
    throw new Error("Entry Price Total is less than Minimum Base Order Size")
  }

  return {
    capital: CAPITAL,
    riskPerc: RISK_PERC,
    market,
    minBaseOrderSize,
    entryPrice,
    stopLossPrice,
    riskAmount,
    numberOfTokens,
    entryPriceTotal,
    stopLossTotal,
    lossTotal,
    lossPerc,
    targetPrice,
    targetPriceTotal,
    profitTotal,
    profitPerc,
    riskRewardRatio,
  }
}

const printMessage = (config: any) => {
  const message = `Capital: ${config.capital}
Risk Percent: ${config.riskPerc}
Market: ${config.market}
Minimum Base Order Size: ${config.minBaseOrderSize}
Entry Price: ${config.entryPrice}
Stop Loss price: ${config.stopLossPrice}
Risk Amount: ${config.riskAmount}
Number of Tokens: ${config.numberOfTokens}
Entry Price Total: ${config.entryPriceTotal}
Stop Loss Total: ${config.stopLossTotal}
Loss Total: ${config.lossTotal}
Loss Percent: ${config.lossPerc}
Target Price: ${config.targetPrice}
Target Price Total: ${config.targetPriceTotal}
Profit Total: ${config.profitTotal}
Profit Percent: ${config.profitPerc}
Risk Reward Ration: 1:${config.riskRewardRatio}
  `

  console.log(message)
}
