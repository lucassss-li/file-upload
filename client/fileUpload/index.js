import { selectFile } from './selectFile.js'
import { upload } from './upload.js'
import { sliceFile } from './sliceFile.js'
import { md5 } from '../../utils/md5.js'

export async function uploadFile() {
  let map, hash
  try {
    //STEP:选择文件
    const file = await selectFile()

    //STEP:计算MD5 hash值
    const fileText = await file.text()
    hash = md5(fileText)

    //STEP:文件切片
    const files = sliceFile(file)

    //STEP:创建上传记录
    map = createMap(hash, files.length)

    //STEP:上传文件
    const res = await upload(hash, files, file.name, map)

    //STEP:上传成功，清楚对应的上传记录
    localStorage.removeItem(hash)
    return res
  } catch (error) {
    //STEP:上传失败，将上传记录序列化存储到localStorage
    map = map.map(el => (el === 2 ? 0 : el))
    localStorage.setItem(hash, map.join('&'))
    return Promise.reject(error)
  }
}

//STEP:获取文件对应的上传记录，localStorage中有则读取并反序列化返回，没有则新建
//STEP:以数组形式保存每个分片的上传状态：0：未上传，1：上传成功，2：正在上传
function createMap(hash, n) {
  let map = localStorage.getItem(hash)
  if (map) {
    map = map.split('&').map(el => +el)
  } else {
    map = Array(n).fill(0)
  }
  return map
}
