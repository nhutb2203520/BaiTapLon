const express =  require("express")
const router = express.Router()
const authenticationController = require("../../controllers/nhanvien.controller")

router.post("/admin/signin", authenticationController.signIn)
      .post("/admin/signup", authenticationController.signUp)
      .post("/admin/logout",authenticationController.signOut)
module.exports = router