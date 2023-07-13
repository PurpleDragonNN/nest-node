function test(val) {
  alert(val[0])
}

export const testScript = String(test) + 'test(arguments)'
