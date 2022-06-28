import { expect, test } from "vitest"
import { main } from "../src/position-size"

test("#positionSize()", () => {
  const market = "POLK-USDT"
  const entryPrice = 0.06329
  const stopLossPrice = 0.05561
  const targetPrice = 0.07737
  const res = main(market, entryPrice, stopLossPrice, targetPrice)
  expect(res).eq(2001)
})
