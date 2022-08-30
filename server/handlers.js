import { FileReceiver } from './FileReceiver.js'
import { parseQuery } from '../utils/parseQuery.js'
import { Buffer } from 'buffer'

const map = {}

export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

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
        map[config.hash] = null
      })
      map[config.hash] = fileReceiver
    }
    res.end(JSON.stringify({ init: true }))
  })
}

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
