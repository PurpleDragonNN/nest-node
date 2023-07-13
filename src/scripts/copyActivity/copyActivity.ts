const xlsx = require('node-xlsx')
const fs = require('fs')
const path = require('path')
import { readdir, cp } from 'node:fs/promises'

const { mkdirp } = require('mkdirp')

// 黑名单, 该目录下不进行复制
const blackList = ['2023年Q1']
// targetParentPath的父级目录，如传入此字段，targetParentPath将被重写
const targetGrandparentPath = 'D:\\开发\\归档\\2023年\\'
// const targetGrandparentPath = '';
// 需要写入文件的活动列表文件夹地址
// let targetParentPath = 'D:\\开发\\结算材料\\%e8%bf%90%e8%90%a5%e7%a0%94%e5%8f%91%e9%83%a8%e7%bb%93%e7%ae%97%e6%9d%90%e6%96%99\\2022年第四批订单10.1-12.31\\分省\\需求结果';
let targetParentPath = 'D:\\开发\\归档\\2023年\\20230401版本'
targetParentPath += '\\'

const categoryData = JSON.parse(
  fs.readFileSync('./test/copyActivity/category.json', 'utf8'),
)
const distPath = 'D:\\开发\\打包文件\\'
let successLog = {}
let failLog = {}

class copyActivity {
  // 批量创建json文件
  async entry() {
    // this.createCategory();

    if (targetGrandparentPath) {
      const grandParent = fs.readdirSync(targetGrandparentPath)
      for (const item of grandParent) {
        if (blackList.includes(item)) {
          // 忽略该目录
          break
        }
        successLog = {}
        failLog = {}
        targetParentPath = targetGrandparentPath + item + '\\'
        console.log(targetParentPath)
        await this.main()
      }
    } else {
      await this.main()
    }

    console.log(
      '以下活动复制成功: ' + Object.keys(successLog).length,
      successLog,
    )
    console.log('以下活动已存在: ' + Object.keys(failLog).length, failLog)
  }

  // 创建活动关联目录json文件，仅首次使用脚本时调用该方法生成目录文件
  createCategory() {
    //读取文件内容
    const obj = xlsx.parse('C:\\Users\\A\\Desktop\\分省活动关联_改造表.xlsx')
    // console.log(obj[0].data);
    const map = {}
    obj[0].data.forEach((item: any[]) => {
      const link =
        item.find((active) => {
          return typeof active === 'string'
            ? active.includes('caiyun.feixin.10086.cn')
            : ''
        }) || ''
      if (link) {
        // map[item[0].trim()] = link.replace(/.*\/portal\/(\w+\b).*/, '$1')
        map[item[0].trim()] = link.match(/\/portal\/(\w+\b)/)[1]
      }
    })
    fs.writeFile(
      `./test/copyActivity/category.json`,
      JSON.stringify(map),
      'utf8',
      (err) => {
        if (err) throw err
      },
    )
  }

  // 获取目标目录下的匹配成功后的结果
  getTargetDirMatch() {
    const targetDir = fs.readdirSync(targetParentPath)
    const success = {}
    const fail = {}
    const noCode = {}
    targetDir.forEach((targetDirItem) => {
      for (const [k, v] of Object.entries(categoryData)) {
        if (k.includes(targetDirItem) || targetDirItem.includes(k)) {
          if (v === '') {
            noCode[targetDirItem] = ''
            return
          }
          categoryData[targetDirItem] = v
          success[targetDirItem] = v
          break
        }
      }
      if (!success[targetDirItem] && noCode[targetDirItem] === undefined) {
        fail[targetDirItem] = ''
      }
    })
    if (Object.keys(fail).length) {
      console.log(
        '以下目录匹配失败,脚本已终止: ' + Object.keys(fail).length,
        fail,
      )
      return
    } else if (Object.keys(noCode).length) {
      console.log('以下活动无代码: ' + Object.keys(noCode).length, noCode)
    }
    return success
  }

  async main() {
    const matchObj = this.getTargetDirMatch()
    if (!matchObj) {
      return
    }

    for (const [key, value] of Object.entries(matchObj)) {
      const itemDir = fs.readdirSync(targetParentPath + key)
      if (itemDir.includes('源代码')) {
        await handleJieSuan(key, value)
      } else if (itemDir.includes('02需求结果')) {
        await handleGuiDang(key, value)
      } else {
        console.log('未找到以下活动的默认目录：', key)
        failLog[key] = ''
      }
    }
  }
}

// 结算材料-复制文件
async function handleJieSuan(key, value) {
  let originPath = ''
  let targetPath = ''
  originPath = distPath + value
  targetPath = targetParentPath + key + '\\源代码'
  if (fs.readdirSync(targetPath).includes('前端')) {
    if (fs.readdirSync(targetPath + '\\前端').length !== 0) {
      failLog[key] = ''
      // 如果已存在则跳过本次循环
      return
    }
  }
  mkdirp.sync(targetPath + '\\前端\\' + value)
  targetPath = targetPath + '\\前端\\' + value

  // 复制目录
  await cp(originPath, targetPath, { recursive: true })
  successLog[key] = targetPath
  return { originPath, targetPath }
}

// 归档-复制文件
async function handleGuiDang(key, value) {
  let originPath = ''
  let targetPath = ''
  originPath = distPath + value
  targetPath = targetParentPath + key + '\\02需求结果\\研发'
  if (fs.existsSync(targetPath)) {
    if (fs.readdirSync(targetPath + '\\前端代码').length !== 0) {
      failLog[key] = ''
      // 如果已存在则跳过本次循环
      return
    }
  } else {
    console.log('未找到以下活动的默认目录：', key)
    return
  }
  mkdirp.sync(targetPath + '\\前端代码\\' + value)
  targetPath = targetPath + '\\前端代码\\' + value

  // 复制目录
  await cp(originPath, targetPath, { recursive: true })
  successLog[key] = targetPath
  return { originPath, targetPath }
}

export default new copyActivity()
