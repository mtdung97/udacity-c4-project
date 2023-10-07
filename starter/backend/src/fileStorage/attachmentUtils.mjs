import * as AWS from 'aws-sdk'
import * as AWSXray from 'aws-xray-sdk'

const XAWS = AWSXray.captureAWS(AWS)

const s3BucketName = process.env.ATTACHMENTS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export class AttachmentUtils {
  constructor() {
    this.s3 = new XAWS.S3({ signatureVersion: 'v4' })
    this.bucketName = s3BucketName
  }

  getAttachmentUrl(todoId) {
    return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
  }

  getUploadUrl(todoId) {
    const url = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: urlExpiration
    })

    return url
  }
}
