import { expect, test } from "vitest"
import { main } from "../src/position-size"

test("#positionSize()", () => {
  const market = "TEL-USDT"
  expect(main(market)).eq(2001)
})
