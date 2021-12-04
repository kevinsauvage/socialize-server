const router = require('express').Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
require('dotenv').config()

router.post('/upload/image', async (req, res) => {
  try {
    const storage = multer.diskStorage({
      filename: (req, file, cb) => {
        const fileExt = file.originalname.split('.').pop()
        const filename = `${new Date().getTime()}.${fileExt}`
        cb(null, filename)
      },
    })

    const upload = multer({ storage }).single('image')

    upload(req, res, (err) => {
      if (err) {
        return res.send(err)
      }

      // SEND FILE TO CLOUDINARY
      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      })

      const { path } = req.file // file becomes available in req at this point

      const fName = req.file.originalname.split('.')[0]

      cloudinary.uploader.upload(
        path,
        {
          resource_type: 'image',
          public_id: fName,
        },

        // Send cloudinary response or catch error
        (err, image) => {
          if (err) return res.send(err)

          return res.send(image)
        },
      )
    })
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while uploading the image.',
    })
  }
})

router.post('/upload/video', async (req, res) => {
  try {
    const storage = multer.diskStorage({
      filename: (req, file, cb) => {
        const fileExt = file.originalname.split('.').pop()
        const filename = `${new Date().getTime()}.${fileExt}`
        cb(null, filename)
      },
    })

    const upload = multer({ storage }).single('video')

    upload(req, res, (err) => {
      if (err) {
        return res.send(err)
      }

      // SEND FILE TO CLOUDINARY
      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      })

      const file = req.file // file becomes available in req at this point

      const fName = req.file.originalname.split('.')[0]

      cloudinary.uploader.upload(
        file.path,
        {
          resource_type: 'video',
          public_id: fName,
        },

        // Send cloudinary response or catch error
        (err, image) => {
          if (err) return res.send(err)

          return res.send(image)
        },
      )
    })
  } catch (error) {
    res.status(error.status || 500).send({
      message:
        error.message || 'Some error occurred while uploading the image.',
    })
  }
})
module.exports = router
