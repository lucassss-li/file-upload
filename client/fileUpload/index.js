import { selectFile } from './selectFile.js'
import { upload } from './upload.js'

export async function uploadFile() {
  try {
    const file = await selectFile()
    const res = upload(file)
    return res
  } catch (error) {
    return Promise.reject(error)
  }
}
