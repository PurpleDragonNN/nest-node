const axios = require('axios')
const fs = require('fs')
const { Builder, Browser, By, Key, until, http } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');
import { testScript } from 'src/scripts/seleniumScript/jsCode'
import { reqCaptch, getScore, checkCaptcha } from 'src/scripts/seleniumScript/request'
import utils from 'src/utils/utils'
import {login} from './page/login'
import seleniumUtils from 'src/utils/seleniumUtils'
export async function scriptEntry() {
  const options = new edge.Options()
  //  在浏览器所在目录下用命令行运行，后半部分为自定义的配置文件目录，
  //  msedge.exe --remote-debugging-port=9222 --user-data-dir="D:\project\ChromeProfile"
  options.options_.debuggerAddress = '127.0.0.1:9222'
  const driver = await new Builder()
    .forBrowser(Browser.EDGE)
    .setEdgeOptions(options)
    .build()
  const $ = seleniumUtils.getSelector(driver, By)
  const getElNums = seleniumUtils.getElNums(driver, By)
  const click = seleniumUtils.click(driver)

  try {
    // await driver.get('https://www.zhihu.com');

    // console.log((await $('.mui-popup-button').getText()) === '同意')
    /*const imgBase64 = await $('.mui-popup').takeScreenshot()
    fs.writeFileSync(
      'src/scripts/seleniumScript/img/Screenshot.png',
      Buffer.from(imgBase64, 'base64'),
    )*/


    await driver.wait(until.elementLocated(By.id('name')), 5000);
    await click('#name')
    return

    await driver.wait(until.elementLocated(By.css('.logout')), 5000);
    const loginText = await driver.executeScript(
      'return document.querySelector(".logout").innerHTML',
    )
    if (loginText === '登录') {
      await driver.get(
        'https://ym.wjw.gz.gov.cn/login.html?institutioncode=&0.9148267857404389',
      )
      await driver.wait(until.elementLocated(By.css('.mui-title')), 5000);
      await login(driver)
    }
    if (
      (await getElNums('.mui-popup-button')) &&
      (await $('.mui-popup-button').getText()) === '同意'
    ) {
      await $('.mui-popup-button').click()
    }
    await click('.hpv_entry')
    await driver.wait(until.elementLocated(By.id('hpv9')), 5000);
    await click('#hpv9')
    await driver.wait(until.elementLocated(By.id('confirm')), 5000);
    await click('#confirm')
    await driver.wait(until.elementLocated(By.id('name')), 5000);
    await click('#name')
    console.log('------------end--------')
  } finally {
    // await driver.quit();
  }
}

class factory {
  getSelector(driver) {
    return function (selector) {
      return driver.findElement(By.css(selector))
    }
  }
}
