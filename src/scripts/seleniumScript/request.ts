/*
 * 超级鹰 http 接口(上传)，node.js 示例代码  http://www.chaojiying.com/
 */
const fs = require('fs')
const axios = require('axios')
const userInfo = {
  user: 'yangzzz',
  pass: '123456mm',
}
// const filename = './captcha.jpg'
// const filename = 'C:\\Users\\A\\Desktop\\image_2023-07-11_09-41-29.png'
const filename = 'D:\\我的文件\\Snipaste-2.8.3-Beta-x64\\history\\D27XAX\\sp20230711_102447_207.png'









async function reqCaptch() {
  /*await axios
    .get('http://oas.richinfo.cn:8088/seeyon/verifyCodeImage.jpg',{responseType: 'arraybuffer'})
    .then((res) => {
      if (res?.data) {
        fs.writeFileSync(`./captcha.jpg`, res.data)
      }
    })*/
  // return getScore()
  // errReq('1219716391166830005')
  // return checkCaptcha(filename)
}

// 识别验证码
function checkCaptcha(filename) {
  const file = filename.startsWith('data:image/')
    ? filename.replace('data:image/png;base64,', '')
    : fs.readFileSync(filename, 'base64')
  return axios
    .post(
      'http://upload.chaojiying.net/Upload/Processing.php',
      JSON.stringify({
        ...userInfo,

        softid: '950556', //软件ID 可在用户中心生成
        codetype: '1004', //验证码类型 http://www.chaojiying.com/price.html 选择
        file_base64: file, // filename: 抓取回来的码证码文件
      }),
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    )
    .then((res) => {
      if (res?.data?.err_no === 0) {
        console.log('识别结果：', res.data.pic_str)
        console.log('返分id：', res.data.pic_id)
        // 70%概率触发返分
        if (Math.random() > 0.3) {
          errReq(res.data.pic_id)
        }
        return res.data.pic_str
      } else {
        console.log(res?.data)
      }
    })
}

// 验证码报错返分
function errReq(id) {
  return axios
    .post(
      'http://upload.chaojiying.net/Upload/ReportError.php',
      JSON.stringify({
        ...userInfo,
        // softid: '950556', //软件ID 可在用户中心生成
        id, // 即识别接口返回来的pic_id字段值
      }),
    )
    .then((res) => {
      if (res?.data?.err_no === 0) {
        console.log('返分成功')
      } else {
        console.log(res?.data)
      }
    })
}

// 查询题分
function getScore() {
  return axios
    .post(
      'http://upload.chaojiying.net/Upload/GetScore.php',
      JSON.stringify({
        ...userInfo,
      }),
    )
    .then((res) => {
      if (res?.data?.err_no === 0) {
        console.log('剩余题分：', res?.data.tifen)
        return res?.data?.tifen
      } else {
        console.log(res?.data)
      }
    })
}

export { reqCaptch, checkCaptcha, getScore }
