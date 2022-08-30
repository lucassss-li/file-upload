import config from '../config.js'
const { url, perSize } = config

export async function upload(hash, files, filename) {
  await startUpload(hash, files, filename)
  let index = 0
  _upload(hash, index, files[index])
}

async function startUpload(hash, files, filename, map) {
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
