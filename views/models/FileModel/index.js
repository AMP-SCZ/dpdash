const FileModel = {
  fromDataURL: (dateURL, fileName) => {
    const arr = dateURL.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      u8arr = new Uint8Array(n)
    let n = bstr.length
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], fileName, { type: mime })
  },
  toDataURL: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.readAsDataURL(file)
      reader.onload = async (e) => {
        resolve(e.target.result)
      }
      reader.onerror = (e) => reject(e)
    })
  },
}

export default FileModel
