import config from '../config.js'
const { url, perSize, parallel } = config

export async function upload(hash, files, filename, map) {
  await startUpload(hash, files, filename)

  return new Promise((resolve, reject) => {
    let _parallel = 0
    while (_parallel < parallel) {
      const index = map.findIndex(el => el === 0)
      if (index === -1) break
      inner(hash, index, resolve, reject)
      _parallel++
    }

    function inner(hash, index, resolve, reject) {
      map[index] = 2
      _upload(hash, index, files[index])
        .then(data => {
          _parallel--
          map[data.index] = 1
          const _index = map.findIndex(el => el === 0)
          if (_index !== -1 && _parallel < parallel) {
            _parallel++
            inner(hash, _index, resolve, reject)
          } else {
            resolve('succeed')
          }
        })
        .catch(error => {
          reject(error)
        })
    }
  })
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
  const res = await fetch(`${url}/upload?hash=${hash}&index=${index}`, {
    mode: 'cors',
    method: 'post',
    headers: {
      'Content-Type': 'application/blob',
    },
    body: file,
  })
  const data = await res.json()
  return data
}
