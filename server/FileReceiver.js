export class FileReceiver {
  constructor(config) {
    const { hash, filename, perSize, count } = config
    this.filename = filename
    this.hash = hash
    this.perSize = perSize
    this.count = count
    this.currentCount = 0
    this.data = Array(count).fill(0)
  }
}
