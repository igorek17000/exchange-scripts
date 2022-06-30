import { expect, test } from "vitest"
import { accountBalance } from "../../src/lib/kucoin-util"
import data from "../../fixtures/kucoin-getAccounts.json"

test("#accountBalance()", () => {
  const res = accountBalance("trade", "USDT", data.data)
  // console.log(res)
  expect(res).eq(349.53682496)
})
