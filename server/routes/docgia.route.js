const express =  require("express")
const router = express.Router()
const authenticationController = require("../../controllers/docgia.controller")

router.post("/user/signin", authenticationController.signIn)
      .post("/user/signup", authenticationController.signUp)
      .post("/user/logout",authenticationController.signOut)
module.exports = router