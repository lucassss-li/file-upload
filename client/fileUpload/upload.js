import config from '../config.js'
const { url, perSize, parallel } = config

export async function upload(hash, files, filename, map) {
  //STEP:向服务端发送文件上传请求
  await startUpload(hash, files, filename)

  //STEP:开始上传文件分片
  return new Promise((resolve, reject) => {
    //STEP:先一次性占满最大并行上传量
    let _parallel = 0
    while (_parallel < parallel) {
      const index = map.findIndex(el => el === 0)
      if (index === -1) break
      inner(hash, index, resolve, reject)
      _parallel++
    }

    function inner(hash, index, resolve, reject) {
      //修改当前分片的上传状态
      map[index] = 2
      _upload(hash, index, files[index])
        .then(data => {
          _parallel--
          map[data.index] = 1
          const _index = map.findIndex(el => el === 0)
          //STEP:每个分片上传成功后，根据并行数剩余量和文件分片剩余量，再发起上传请求
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
