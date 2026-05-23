import { CloudinaryMediaNode } from '../types/property.types'

const CLOUD_NAME = 'do5lkisxf'
const UPLOAD_PRESET = 'rb7pszuz'
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

export const mediaService = {
  async upload(file: File): Promise<CloudinaryMediaNode> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Cloudinary upload failed')

    const data = await res.json()
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
      type: data.resource_type,
    }
  },
}
