import { google } from 'googleapis'
import { Readable } from 'stream'
import { config } from '@/config'
import { compressImage, createCompressedFile, isCompressionAvailable } from '@/lib/image/compressor'

const SCOPES = ['https://www.googleapis.com/auth/drive']

// Initialize Google Drive API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: config.google.clientEmail,
    private_key: config.google.privateKey?.replace(/\\n/g, '\n'),
  },
  scopes: SCOPES,
})

const drive = google.drive({ version: 'v3', auth })

export interface UploadResult {
  previewUrl: string
  directUrl: string
  fileId: string
}

/**
 * Upload a file to a shared Google Drive folder.
 * @param file The file object to upload
 * @param folderId The ID of the folder shared with the service account
 * @returns Object containing preview URL, direct download URL, and file ID
 */
export async function uploadFile(file: File, folderId: string | undefined): Promise<UploadResult> {
  if (!folderId) {
    throw new Error('Google Drive Folder ID is not configured. Please set GOOGLE_DRIVE_FOLDER_ID in your environment variables.')
  }

  const isImage = file.type.startsWith('image/')

  try {
    // Handle image compression with Tinify (before upload)
    let fileToUpload = file

    if (isImage && isCompressionAvailable()) {
      try {
        console.log('[Google Drive] Compressing image before upload...')
        const compressed = await compressImage(file)
        fileToUpload = createCompressedFile(compressed.buffer, file.name)
        console.log('[Google Drive] Image compressed successfully')
      } catch (error: any) {
        console.warn('[Google Drive] Image compression failed, uploading original:', error.message)
        // Continue with original file if compression fails
      }
    }

    // Upload file to Google Drive
    const uploadBuffer = Buffer.from(await fileToUpload.arrayBuffer())
    const uploadStream = Readable.from(uploadBuffer)

    const uploadResponse = await drive.files.create({
      requestBody: {
        name: fileToUpload.name,
        mimeType: fileToUpload.type,
        parents: [folderId],
      },
      media: {
        mimeType: fileToUpload.type,
        body: uploadStream,
      },
      fields: 'id, webViewLink',
    })

    if (!uploadResponse.data.id) {
      throw new Error('File uploaded but no ID was returned from Google Drive.')
    }

    // Make the file publicly readable so the link works
    await drive.permissions.create({
      fileId: uploadResponse.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    })

    // Return both preview URL and direct download URL
    const uploadFileId = uploadResponse.data.id
    return {
      previewUrl: `https://drive.google.com/file/d/${uploadFileId}/preview`,
      directUrl: `https://drive.google.com/uc?export=download&id=${uploadFileId}`,
      fileId: uploadFileId
    }
  } catch (error: any) {
    // Log the detailed error for better debugging
    console.error('Full error object from Google Drive API:', JSON.stringify(error, null, 2));

    if (error.code === 403) {
      throw new Error('Permission denied. Please double-check these two things: 1) The Google Drive API is enabled in your Google Cloud project. 2) The service account has "Editor" access to the specified Google Drive folder.')
    }
    if (error.code === 404) {
       throw new Error(`Google Drive folder with ID "${folderId}" not found. Please check your GOOGLE_DRIVE_FOLDER_ID.`)
    }
    throw new Error('Failed to upload file to Google Drive.')
  }
}

/**
 * Delete a file from a Google Drive folder
 * @param fileUrl The URL of the file to delete
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  if (!fileUrl) return false

  try {
    // Extract ID from a Google Drive URL
    const match = fileUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)
    const fileId = match ? match[1] : null

    if (!fileId) {
      console.warn('Could not extract file ID from URL for deletion:', fileUrl)
      return false
    }

    await drive.files.delete({
      fileId,
    })
    return true
  } catch (error: any) {
    console.error('Failed to delete file from Google Drive. It may have been already deleted:', error.message)
    return false
  }
}
