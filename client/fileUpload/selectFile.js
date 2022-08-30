export function selectFile() {
    return new Promise((resolve, reject) => {
        try {
            const file_input = document.createElement('input')
            file_input.type = "file"
            file_input.onchange = () => {
                resolve(file_input.files[0])
            }
            file_input.click()
        } catch (error) {
            reject(error)
        }
    })
}