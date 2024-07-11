const fs = require('fs')

class utils {
  // 根据选择器获取元素
  getSelector(driver, By) {
    return function (selector) {
      return driver.findElement(By.css(selector))
    }
  }
  // 根据选择器获取元素数量
  getElNums(driver, By) {
    return async function (selector) {
      return (await driver.findElements(By.css(selector))).length
    }
  }
  // selenium原生click方法会被await阻塞，原因不明
  click(driver) {
    return async function (selector) {
      return await driver.executeScript(
        `document.querySelector("${selector}").click()`,
      )
    }
  }
}

export default new utils()

