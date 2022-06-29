import { expect, test } from "vitest"
import { main } from "../src/position-size"

test("#positionSize()", () => {
  const market = "ATOM-USDT"
  const entryPrice = 7.3143
  const stopLossPrice = 6.9013
  const targetPrice = 8.3869
  const res = main(market, entryPrice, stopLossPrice, targetPrice)
  console.log(res)
  // expect(res).eq(2001)
})
