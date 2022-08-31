import { Buffer } from 'buffer'
import { existsSync, mkdirSync, writeFile } from 'fs'
import { resolve } from 'path'
export class FileReceiver {
  constructor(config, clear) {
    const { hash, filename, perSize, count } = config
    this.filename = filename
    this.hash = hash
    this.perSize = perSize
    this.count = count
    this._currentCount = 0
    this.data = Array(count).fill(0)
    this.clear = clear
  }
  //STEP:每次接收文件切片时，设置currentCount值，触发拦截器
  set currentCount(n) {
    this._currentCount = n
    //STEP:当所有分片接受完后，开始写入文件
    if (this.data.every(el => el !== 0)) {
      this.write()
    }
  }
  get currentCount() {
    return this._currentCount
  }
  write() {
    //STEP:将文件分片进行重新组合
    const data = Buffer.concat(this.data)
    if (!existsSync(resolve('../files/'))) {
      mkdirSync(resolve('../files/'))
    }
    writeFile(
      resolve('../files/' + this.filename),
      data,
      { encoding: 'utf-8' },
      () => {
        this.clear()
      },
    )
  }
}
