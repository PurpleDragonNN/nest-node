const fs = require('fs')

class utils {
  // 批量创建json文件
  crateJsons(): void {
    const jsons: string[] = []
    const dataStr = fs.readFileSync('./test.txt', 'utf8')
    const dataArr = dataStr.match(/\/market\/redeposit\/[\S]*/g) || []
    dataArr.forEach((item) => {
      const fileName = item.replace(/\/market\/redeposit\//g, '')
      console.log(fileName)
      let str = dataStr.slice(
        dataStr.indexOf('响应示例', dataStr.indexOf(item)),
      )
      str = str.slice(str.indexOf('{'), str.search(/\n{2,}/))
      // console.log(str);
      const jsonValue = str.match(/\{[\s\S]*\}$/g)
      if (jsonValue) {
        fs.writeFile(
          `D:\\我的文件\\mock接口json文件\\${fileName}.json`,
          jsonValue[0],
          (err) => {
            if (err) throw err
          },
        )
      }
    })
  }
}

export default new utils()

// 读取docx文件并写入txt文件
function writeTxt(path): void {
  const str = readDocx(path)
  fs.writeFile('./test.txt', str, (err) => {
    if (err) throw err
  })
  console.log(str)
}

// 读取docx文件
function readDocx(path): string {
  const AdmZip = require('adm-zip') //引入查看zip文件的包
  const zip = new AdmZip(path) //filePath为文件路径
  const contentXml = zip.readAsText('word/document.xml') //将document.xml读取为text内容；
  let str = ''
  const wp = contentXml.match(/<w:p>[\s\S]*?<\/w:p>/gi)
  wp.forEach((wpItem) => {
    const lineItems: string[] = wpItem.match(/<w:t>[\s\S]*?<\/w:t>/gi)
    if (lineItems && lineItems.length) {
      lineItems.forEach((item) => {
        str += item.slice(5, -6)
      })
      str += '\n'
    }
  })
  /*fs.writeFile('./2.txt', str, (err) => {
    if (err) throw err;
  });*/
  return str
}
