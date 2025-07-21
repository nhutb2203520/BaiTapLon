const express =  require("express")
const router = express.Router()
const authenticationController = require('../controllers/XacThuc.controller')


router.post("/signin", authenticationController.signIn)
      .post("/signup", authenticationController.signUp)
      .post("/staffsignup", authenticationController.staffSignUp)
      .post("/staffsignin", authenticationController.staffSignIn)
      .post("/logout",authenticationController.signOut)
module.exports = router
