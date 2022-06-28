import { expect, test } from "vitest"
import { positionSize } from "../src/position-size"

test("#positionSize()", () => {
  expect(positionSize()).eq(2001)
})
