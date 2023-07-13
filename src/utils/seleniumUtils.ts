const fs = require('fs')

class utils {
  getSelector(driver, By) {
    return function (selector) {
      return driver.findElement(By.css(selector))
    }
  }
  getElNums(driver, By) {
    return async function (selector) {
      return (await driver.findElements(By.css(selector))).length
    }
  }
}

export default new utils()

