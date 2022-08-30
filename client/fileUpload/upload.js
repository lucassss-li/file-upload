import config from '../config.js'
import { md5 } from '../../utils/md5.js'
const { url, perSize, parallel } = config

function sliceFile(file) {
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

export async function upload(file) {
  const fileText = await file.text()
  const hash = md5(fileText)
  const files = sliceFile(file)
  await startUpload(hash, files, file.name)
  let index = 0
  _upload(hash, index, files[index])
}

async function startUpload(hash, files, filename) {
  const res = await fetch(url + '/startUpload', {
    mode: 'cors',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      hash,
      filename,
      perSize,
      count: files.length,
    }),
  })
  const data = await res.json()
  return data
}

export async function _upload(hash, index, file) {
  console.log(file)
  const res = await fetch(`${url}/upload?hash=${hash}&index=${index}`, {
    mode: 'cors',
    method: 'post',
    body: file,
  })
  const data = await res.json()
  return data
}
