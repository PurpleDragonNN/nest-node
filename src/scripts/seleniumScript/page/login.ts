import { checkCaptcha } from '../request'
import seleniumUtils from 'src/utils/seleniumUtils'
const { Builder, Browser, By, Key, until } = require('selenium-webdriver');

export async function login(driver) {
  const $ = seleniumUtils.getSelector(driver, By)
  // 输入用户名
  await $('#phone').clear()
  await $('#phone').sendKeys('13071606109')

  // 输入密码
  const pw = await driver.findElements(By.css('.password'))
  for (const item of pw) {
    if (await item.isDisplayed()) {
      await item.clear()
      await item.sendKeys('123456Mm!')
      break
    }
  }
  // 等待验证码刷新时的loading出现
  await driver.wait(until.elementLocated(By.css('.layui-layer-shade')), 20000);
  // 等待验证码刷新时的loading消失
  await driver.wait(async () => {
    const loading = await driver.findElements(By.css('.layui-layer-shade'))
    return !loading.length
  }, 2000)

  const base64 = await $('#picyzm').getAttribute('src')
  await $('#vcode').clear()
  const captcha = await checkCaptcha(base64)
  await $('#vcode').sendKeys(captcha)
  // console.log(base64)
  // 勾选同意
  await driver.executeScript(
    'arguments[0].setAttribute("isaccept", "1")',
    $('#accept'),
  )
  // 登录
  await $('#btnCommit').sendKeys(Key.ENTER)

}
