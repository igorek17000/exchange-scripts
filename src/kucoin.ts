import yargs from "yargs"
import questions from "questions"
import { main, printMessage } from "./position-size"
import { v4 as uuidv4 } from "uuid"
import api from "kucoin-node-api"
import { accountBalance, sleep } from "./lib/kucoin-util"

// console.log(process.env)
if (!process.env.KUCOIN_APIKEY || !process.env.KUCOIN_APISECRETKEY || !process.env.KUCOIN_PASSPHRASE) {
  throw new Error("Required KUCOIN_* environment vars missing!")
}
const config = {
  apiKey: process.env.KUCOIN_APIKEY,
  secretKey: process.env.KUCOIN_APISECRETKEY,
  passphrase: process.env.KUCOIN_PASSPHRASE,
  environment: "live",
}

api.init(config)

const args: any = yargs
  .option("ticker", {
    alias: "t",
    description: "Ticker",
    demand: true,
  })
  .option("entry", {
    alias: "e",
    description: "Entry",
    demand: true,
  })
  .option("stop", {
    alias: "s",
    description: "Stop Loss",
    demand: true,
  })
  .option("profit", {
    alias: "p",
    description: "Take Profit",
    demand: true,
  })
  .usage("==> Usage example: node dist/$0 -t BTC -e 100 -s 90 -p 120").argv

// console.log(JSON.stringify(args))

// TODO

// confirm place order
const confirmOrder = async () => {
  return new Promise((resolve, reject) => {
    questions.askOne({ info: "Confirm place order?" }, function (result: any) {
      if (result !== "y" && result !== "yes") {
        return reject("no")
      }
      resolve("yes")
    })
  })
}

;(async () => {
  try {
    const symbol = `${args.ticker.toUpperCase()}-USDT`

    const config = main(symbol, Number(args.entry), Number(args.stop), Number(args.profit))
    // console.log(config)
    printMessage(config)

    // check there is enough available balance for this order
    let accounts = await api.getAccounts()
    // console.log(JSON.stringify(accounts, null, 2))
    const usdtAvailableBalance = accountBalance("trade", "USDT", accounts.data)
    if (Number(config!.entryPriceTotal) > usdtAvailableBalance) {
      console.log(`==> Order Size: ${config!.entryPriceTotal}`)
      console.log(`==> Available Balance: ${usdtAvailableBalance}`)
      throw new Error("Not enought USDT balance avaialble for this order size.")
    }

    const confirm = await confirmOrder()
    // console.log(confirm)
    if (confirm !== "yes") {
      console.log("No order placed. Done.")
      return false
    }

    const params = {
      clientOid: uuidv4(),
      side: "buy",
      symbol,
      type: "market", // default: limit]
      funds: config!.entryPriceTotal,
    }
    // console.log(params)
    console.log(`==> Placing Market Buy Order: ${symbol} $${config!.entryPriceTotal}`)
    const marketBuyOrder = await api.placeOrder(params)
    // { code: '200000', data: { orderId: '62bdde4e069bc70001bd59d1' } }
    // console.log("marketBuyOrder", marketBuyOrder)

    if (!marketBuyOrder.code || Number(marketBuyOrder.code) !== 200000) {
      console.log("marketBuyOrder", marketBuyOrder)
      throw new Error("Market Buy Order Failed.")
    }

    // check balance available
    await sleep(2000)
    accounts = await api.getAccounts()
    const orderAvailableBalance = accountBalance("trade", args.ticker.toUpperCase(), accounts.data)
    // console.log(orderAvailableBalance)

    // TODO cancel any existing orders for this symbol
    // api.cancelAllOrders({symbol: 'xxxxx'})

    // TODO look this value up from the symbols list
    const baseIncrement = 4

    // set stop market - loss
    const stopParams = {
      clientOid: uuidv4(),
      side: "sell",
      stop: "loss",
      stopPrice: config!.stopLossPrice,
      symbol,
      type: "market", // default: limit]
      size: orderAvailableBalance.toFixed(baseIncrement),
    }
    // console.log("Stop Loss Params", stopParams)

    console.log(`==> Placing Stop Loss Market Sell Order: ${symbol} $${config!.stopLossPrice}`)
    const marketStopLossSellOrder = await api.placeOrder(stopParams)
    // { code: '200000', data: { orderId: 'vsacuoltshiqav06000s2cb2' } }
    // console.log("marketStopLossSellOrder", marketStopLossSellOrder)

    if (!marketStopLossSellOrder.code || Number(marketStopLossSellOrder.code) !== 200000) {
      console.log("Stop Loss Params", stopParams)
      console.log("Market Stop Loss Sell Order", marketStopLossSellOrder)
      throw new Error("Market Stop Loss Order Failed.")
    }

    // set stop market - profit

    await sleep(2000)

    const stopProfitParams = {
      clientOid: uuidv4(),
      side: "sell",
      stop: "entry",
      stopPrice: config!.targetPrice,
      symbol,
      type: "market", // default: limit]
      size: orderAvailableBalance.toFixed(baseIncrement),
    }
    // console.log("Stop Profit Params", stopProfitParams)

    console.log(`==> Placing Stop Profit Market Sell Order: ${symbol} $${config!.targetPrice}`)

    const marketStopProfitSellOrder = await api.placeOrder(stopProfitParams)
    // { code: '200000', data: { orderId: 'vsacuoltsqr2cv9t000r3vft' } }
    // console.log("marketStopProfitSellOrder", marketStopProfitSellOrder)

    if (!marketStopProfitSellOrder.code || Number(marketStopProfitSellOrder.code) !== 200000) {
      console.log("Stop Profit Params", stopParams)
      console.log("Market Stop Profit Sell Order", marketStopProfitSellOrder)
      throw new Error("Market Stop Profit Order Failed.")
    }
  } catch (error) {
    console.log(error)
  }
})()
