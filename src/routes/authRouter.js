const express = require("express")
const authController = require("../controllers/authController")
const router = express.Router()

// 회원가입 라우트 
router.post("/signup", authController.signup)
router.post("/login", authController.login)

module.exports = router