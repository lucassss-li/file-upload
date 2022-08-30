import config from '../config.js'
const { perSize } = config
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
