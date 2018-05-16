import formidable from 'formidable'
import { GridFSBucket } from 'mongodb'
import fs from 'fs'

const files = db => {
  const api = {}

  api.upload = async (req, res) => {
    try {
      var form = new formidable.IncomingForm()
      form.uploadDir = './uploads'
      form.on('progress', function(recv, total) {
        // File size check ( <= 30Mb )
        if (total > 30 * 1024 * 1024) {
          throw new Error('file too large')
        }
      })
      form.on('file', function(name, file) {
        var bucket = new GridFSBucket(db)
        fs
          .createReadStream('./uploads/' + name)
          .pipe(bucket.openUploadStream(name))
          .on('error', function(error) {
            res.status(500).end()
          })
          .on('finish', function() {
            res.status(200).end()
          })
      })
      form.parse(req, (err, fields, files) => {
        res.status(200).end()
      })
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  return api
}

export default files
