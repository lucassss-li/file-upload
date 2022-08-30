import config from '../config.js'
const { perSize } = config
export function sliceFile(file) {
  const fileArr = []
  let totalSize = file.size
  let start = 0
  while (totalSize > 0) {
    fileArr.push(file.slice(start, perSize, file.type))
    start += perSize
    totalSize -= perSize
  }
  return fileArr
}
