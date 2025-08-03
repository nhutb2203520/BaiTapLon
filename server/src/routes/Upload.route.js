const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = express.Router()

const uploadsDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => {
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${file.fieldname}-${name}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(new Error('Chỉ chấp nhận file ảnh'), false)
  }
})

router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, message: 'Không có file được upload' })

  res.json({
    success: true,
    message: 'Upload ảnh thành công',
    imageUrl: `/uploads/${req.file.filename}`
  })
})

router.get('/test', (_, res) => res.json({ success: true, message: 'Upload OK', uploadsDir }))

module.exports = router
