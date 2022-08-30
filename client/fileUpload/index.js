import { selectFile } from './selectFile.js'
import { upload } from './upload.js'
import { sliceFile } from './sliceFile.js'
import { md5 } from '../../utils/md5.js'
import { MyMap } from './MyMap.js'

export async function uploadFile() {
  let map, hash
  try {
    const file = await selectFile()
    const fileText = await file.text()
    hash = md5(fileText)
    const files = sliceFile(file)
    map = createMap(hash, files.length)
    const res = upload(hash, files, file.name, map)
    return res
  } catch (error) {
    // TODO:上传失败，使用localStorage存储上传信息
    return Promise.reject(error)
  }
}

function createMap(hash, n) {
  let map = localStorage.getItem(hash)
  if (!map) {
    map = new MyMap()
    for (let i = 0; i < n; i++) {
      map.set(i, false)
    }
  }
  return map
}
