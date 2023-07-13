const axios = require('axios')
const fs = require('fs')
const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');
import { testScript } from 'src/scripts/seleniumScript/jsCode'
import { reqCaptch, getScore, checkCaptcha } from 'src/scripts/seleniumScript/request'
import utils from 'src/utils/utils'
import {login} from './page/login'
import seleniumUtils from 'src/utils/seleniumUtils'
export async function example() {
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

  try {
    // await driver.get('https://www.zhihu.com');
    // await login(driver)

    // console.log((await $('.mui-popup-button').getText()) === '同意')
    /*const imgBase64 = await $('.mui-popup').takeScreenshot()
    fs.writeFileSync(
      'src/scripts/seleniumScript/img/Screenshot.png',
      Buffer.from(imgBase64, 'base64'),
    )*/
    return
    driver.wait(until.elementLocated(By.css('.hpv_entry')));
    if ((await $('.logout').getText()) === '登录') {
      await driver.get(
        'https://ym.wjw.gz.gov.cn/login.html?institutioncode=&0.9148267857404389',
      )
    }
    if (
      (await getElNums('.mui-popup-button')) &&
      (await $('.mui-popup-button').getText()) === '同意'
    ) {
      await $('.mui-popup-button').click()
    }
    // $('.hpv_entry')
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
