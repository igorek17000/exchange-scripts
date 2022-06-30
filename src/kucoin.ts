import yargs from "yargs"
import questions from "questions"
import { main, printMessage } from "./position-size"
import { v4 as uuidv4 } from "uuid"
import api from "kucoin-node-api"
import { accountBalance } from "./lib/kucoin-util"

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
    const accounts = await api.getAccounts()
    // console.log(JSON.stringify(accounts, null, 2))
    const usdtAvailableBalance = accountBalance("trade", "USDT", accounts.data)
    if (Number(config!.entryPriceTotal) > usdtAvailableBalance) {
      console.log(`==> Order Size: ${config!.entryPriceTotal}`)
      console.log(`==> Available Balance: ${usdtAvailableBalance}`)
      throw new Error("Not enought USDT balance avaialble for this order size.")
    }

    // const confirm = await confirmOrder()
    // // console.log(confirm)
    // if (confirm !== "yes") {
    //   console.log("No order placed. Done.")
    //   return false
    // }

    /* 
  Place a new order
  POST /api/v1/orders
  Details for market order vs. limit order and params see https://docs.kucoin.com/#place-a-new-order
  General params
  params = {
    clientOid: string
    side: string ['buy' || 'sell]
    symbol: string
    type: string [optional, default: limit]
    remark: string [optional]
    stop: string [optional] - either loss or entry and needs stopPrice
    stopPrice: string [optional] - needed for stop 
    stp: string [optional] (self trade prevention)
    price: string,
    size: string,
    timeInForce: string [optional, default is GTC]
    cancelAfter: long (unix time) [optional]
    hidden: boolean [optional]
    Iceberg: boolean [optional]
    visibleSize: string [optional]
  }
*/
    const params = {
      clientOid: uuidv4(),
      side: "buy",
      symbol,
      type: "market", // default: limit]
      size: config!.entryPriceTotal,
    }
    console.log("Market Order: ", params)
    // api.placeOrder(params)
  } catch (error) {
    console.log(error)
  }
})()

// questions.askMany(
//   {
//     name: { info: "Name" },
//     age: { info: "Age" },
//     phone: { info: "Phone", required: false },
//   },
//   function (result: any) {
//     console.log(result)
//   }
// )
// place market order
// place stop market - loss
// place stop market - profit
