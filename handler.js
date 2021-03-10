'use strict'
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const Bucket = 'first-bucket-test-123123'

module.exports.saveFile = async event => {
  console.log(event)
  const params = {
    Bucket,
    Key: event.queryStringParameters.file,
    Body: event.queryStringParameters.content,
  }

  const retour = s3.putObject(params).promise()

  const ret = await retour
  console.log(ret)

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: JSON.stringify(ret),
        input: event,
      },
      null,
      2
    ),
  }
}

module.exports.listFiles = async event => {
  try {
    const params = {
      Bucket,
      // MaxKeys: 2,
    }
    const pRet = new Promise((resolve, reject) => {
      s3.listObjectsV2(params, function(err, data) {
        if (err) reject(err)
        else resolve(data)
      })
    })
    const ret = await pRet
    console.log(ret)
    return { statusCode: 200, body: JSON.stringify(ret.Contents) }
  } catch (e) {
    console.log(e)
    return { statusCode: 200, body: JSON.stringify(e) }
  }
}

module.exports.getObject = async event => {
  try {
    const params = {
      Bucket,
      Key: event.queryStringParameters.file,
    }

    const pRet = new Promise((resolve, reject) => {
      s3.getObject(params, function(err, data) {
        if (err) reject(err)
        else resolve(data)
      })
    })
    const ret = await pRet
    console.log(ret)
    return { statusCode: 200, body: ret.Body.toString('utf8') }
  } catch (e) {
    console.log(e)
    return { statusCode: 200, body: JSON.stringify(e, event) }
  }
}
