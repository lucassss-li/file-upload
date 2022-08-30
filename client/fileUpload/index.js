import { selectFile } from './selectFile.js'
import { upload } from './upload.js'
import { sliceFile } from './sliceFile.js'
import { md5 } from '../../utils/md5.js'

export async function uploadFile() {
  let map, hash
  try {
    const file = await selectFile()
    const fileText = await file.text()
    hash = md5(fileText)
    const files = sliceFile(file)
    map = createMap(hash, files.length)
    const res = await upload(hash, files, file.name, map)
    localStorage.removeItem(hash)
    return res
  } catch (error) {
    map = map.map(el => (el === 2 ? 0 : el))
    localStorage.setItem(hash, map.join('&'))
    return Promise.reject(error)
  }
}

function createMap(hash, n) {
  let map = localStorage.getItem(hash)
  if (map) {
    map = map.split('&').map(el => +el)
  } else {
    map = Array(n).fill(0)
  }
  return map
}
