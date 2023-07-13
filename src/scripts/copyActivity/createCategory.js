// 创建归档活动目录

const fs = require('fs')
let toCreateList = [] // 需要创建的目录
let targetParentPath = 'D:\\开发\\归档\\2023年\\' // 需配置
// 需要创建的版本名称和版本内的活动名称，需配置
const versionPath = {
  '20230427版本': [
    '江西_三重礼_V2.2',
    '安徽_TV登录有礼_V1.0',
    '广东_三合一_V1.0',
    '湖北_三重礼_V1.5',
    '上海_邀请好友订会员_V1.1',
  ],
  '20230429版本': ['四川_登录有礼_v1.0'],
}
// 活动内目录结构
const newCategory = {
  '01需求来源': '',
  '02需求结果': {
    测试: '',
    产品: '',
    上线: '',
    研发: {
      后端代码: '',
      前端代码: '',
      设计文档: '',
    },
  },
}

function getFullPath(version, categoryArr) {
  let suffixPaths = getSuffixPaths(newCategory, '', [])
  categoryArr.forEach((item) => {
    suffixPaths.forEach((sufItem) => {
      toCreateList.push(targetParentPath + version + '\\' + item + sufItem)
    })
  })
}

// 根据newCategory创建路径
function getSuffixPaths(obj, path, arr = []) {
  for (const [key, val] of Object.entries(obj)) {
    if (val) {
      path += '\\' + key
      getSuffixPaths(val, path, arr)
    } else {
      arr.push(path + '\\' + key)
    }
  }
  return arr
}

// 创建多级目录
function createCategory(path) {
  let initPath = ''
  let pathArr = path.split('\\')
  for (let i = 0; i < pathArr.length; i++) {
    initPath += pathArr[i] + '\\'
    if (!fs.existsSync(initPath)) {
      fs.mkdirSync(initPath)
      console.log('创建成功：', initPath)
    }
  }
}

for (const [key, value] of Object.entries(versionPath)) {
  getFullPath(key, value)
}

toCreateList.forEach(async (path) => {
  createCategory(path)
})
