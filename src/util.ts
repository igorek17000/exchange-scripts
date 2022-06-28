export const countDecimals = function (num: number) {
  if (Math.floor(num.valueOf()) === num.valueOf()) return 0
  return num.toString().split(".")[1].length || 0
}
