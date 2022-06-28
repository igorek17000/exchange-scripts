import { expect, test } from "vitest"
import { main } from "../src/position-size"

test("#positionSize()", () => {
  const market = "EDG-USDT"
  const entryPrice = 0.001833
  const stopLossPrice = 0.001654
  const targetPrice = 0.002085
  const res = main(market, entryPrice, stopLossPrice, targetPrice)
  expect(res).eq(2001)
})
