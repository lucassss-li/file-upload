import { createServer } from 'http'
// import { createWriteStream } from 'fs'

import { startUpload, upload, cors } from './handlers.js'

const server = createServer()

server.on('request', (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') {
    res.end()
    return
  }
  const match = req.url.match(/(\/(.+?)\?)|(\/(.+?$))/)
  const code = match[2] || match[4]
  switch (code) {
    case 'startUpload': {
      startUpload(req, res)
      break
    }
    case 'upload': {
      upload(req, res)
      break
    }
  }

  //   if (req.method === 'POST') {
  //     const ws = createWriteStream('./data.jpeg', {
  //       encoding: 'utf-8',
  //     })
  //     req.on('data', data => {
  //       ws.write(data, 'utf-8')
  //     })
  //     req.on('end', data => {
  //       data && ws.write(data, 'utf-8')
  //       ws.end()
  //       cors(req)
  //       res.end(JSON.stringify({ upload: true }))
  //     })
  //   }
})

server.listen('9999', () => {
  console.log('server start')
})
