import { FileReceiver } from './FileReceiver.js'
import { parseQuery } from '../utils/parseQuery.js'

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
    const fileReceiver = new FileReceiver(config)
    map[config.hash] = fileReceiver
    res.end(JSON.stringify({ init: true }))
  })
}

export function upload(req, res) {
  const params = parseQuery(req.url)
  const { hash, index } = params
  let chunk = ''
  req.on('data', data => {
    chunk += data
  })
  req.on('end', data => {
    data && (chunk += data)
    const fr = map[hash]
    fr.data[index] = chunk
    fr.currentCount++
    console.log(fr)
    res.end(JSON.stringify(params))
  })
}
