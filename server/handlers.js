import { FileReceiver } from './FileReceiver.js'
import { parseQuery } from '../utils/parseQuery.js'
import { Buffer } from 'buffer'

//STEP:储存文件接收对象
//STEP:源文件MD5 hash值作为键值
const map = {}

export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

//STEP:初始化文件传输接收对象
export function startUpload(req, res) {
  let chunk = ''
  req.on('data', data => {
    chunk += data
  })
  req.on('end', data => {
    data && (chunk += data)
    const config = JSON.parse(chunk)
    if (!map[config.hash]) {
      const fileReceiver = new FileReceiver(config, () => {
        //STEP:文件完全接收完后，删除对应的接收对象
        //STEP:没删除前，对应文件的已接收分片一直存在，所以客户端可以断点重传
        map[config.hash] = null
      })
      map[config.hash] = fileReceiver
    }
    res.end(JSON.stringify({ init: true }))
  })
}

//STEP:接收文件切片
export function upload(req, res) {
  const params = parseQuery(req.url)
  const { hash, index } = params
  let chunks = []
  req.on('data', data => {
    chunks.push(data)
  })
  req.on('end', data => {
    data && chunks.push(data)
    const fr = map[hash]
    fr.data[index] = Buffer.concat(chunks)
    fr.currentCount++
    res.end(JSON.stringify(params))
  })
}
