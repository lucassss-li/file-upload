import config from '../config.js'
const { perSize } = config

//STEP:根据配置文件中的分片大小对文件进行分片
//STEP:文件是BLOB对象
export function sliceFile(file) {
  const fileArr = []
  const totalSize = file.size
  let start = 0
  let end = perSize
  while (start <= totalSize) {
    fileArr.push(file.slice(start, end, file.type))
    start = end
    end += perSize
  }
  return fileArr
}
