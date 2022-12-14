import { createServer } from 'http'

import { startUpload, upload, cors } from './handlers.js'

const server = createServer()

server.on('request', (req, res) => {
  // STEP:处理跨域
  cors(res)
  if (req.method === 'OPTIONS') {
    res.end()
    return
  }

  //STEP:获取路由
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
})

server.listen('9999', () => {
  console.log('server start')
})
