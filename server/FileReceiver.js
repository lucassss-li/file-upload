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
  set currentCount(n) {
    this._currentCount = n
    if (this.data.every(el => el !== 0)) {
      this.write()
    }
  }
  get currentCount() {
    return this._currentCount
  }
  write() {
    const data = Buffer.concat(this.data)
    if (!existsSync(resolve('../images/'))) {
      mkdirSync(resolve('../images/'))
    }
    writeFile(
      resolve('../images/' + this.filename),
      data,
      { encoding: 'utf-8' },
      () => {
        this.clear()
      },
    )
  }
}
