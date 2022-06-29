import yargs from "yargs"
import { main, printMessage } from "./position-size"

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

const res = main(`${args.ticker.toUpperCase()}-USDT`, Number(args.entry), Number(args.stop), Number(args.profit))
// console.log(res)
printMessage(res)
