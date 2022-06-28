import { expect, test } from "vitest"
import { hw } from "../src/one"

test("hw", () => {
  expect(hw()).eq("hello world")
})
