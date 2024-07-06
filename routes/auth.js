const express = require("express")
const router = express.Router();
const User = require("../models/User.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const createError = require("../middleware/error.js");
const otpGen = require("otp-generator");
const { sendEmail } = require("../EmailService.js");
const { verifyToken } = require("../middleware/verifyToken.js");





router.post("/register", async (req, res, next) => {
    const { email, password, username, confirmPassword } = req.body;
    try {

        const oldUserByEmail = await User.findOne({ email });
        const oldUserByUsername = await User.findOne({ username });



        if (oldUserByEmail) return next(createError(404, "User Already Exist With This Email"));
        if (oldUserByUsername) return next(createError(404, "User Already Exist With This Username"));
        if (password !== confirmPassword) {
          return next(createError(400, "Passwords does not match"));
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const result = await User.create({ email, password: hash, username});
        res.status(200).json({msg: "User has been created.", result});
    } catch (err) {
      next(err);
    }
  })

router.post("/logout", verifyToken, async(req, res) => {
    res.clearCookie("access_token")
    req.cookies["access_token"] = "";
    return res.json("Success")
})


var otp
function generateOTP(){
    otp = otpGen.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
}
router.post("/login", async (req, res, next) => {

        try {
          const user = await User.findOne({ email: req.body.email });
          if (!user) return next(createError(404, "User not found!"));
      
          const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
          );
          if (!isPasswordCorrect) return next(createError(404, "Wrong password!"));

              // Generate OTP
              // Send OTP via email
          if (!user.isVerified) {
            generateOTP()
            const emailContent = `
            <h1>OTP Verification</h1>
            <p>Hello</p>
            <p>Your OTP: <strong>${otp}</strong></p>
            <p>Please use this OTP to complete the verification process.</p>
            <p>Thank you!</p>
          `;

            await sendEmail(req.body.email, 'OTP Verification', emailContent)
          }
              
          const token = jwt.sign(
            { id: user._id,
              isAdmin: user.isAdmin
            },
            "123",
            { expiresIn: "1296000s" }
            );
      
          const { password, ...otherDetails } = user._doc;
          res.cookie("access_token", token, {
              httpOnly: true,
              expires: new Date(Date.now() + 1296000000),
              sameSite: 'None',
              secure: true
            })
            .status(200)
            .json({ details: { ...otherDetails } });
    } catch (err) {
      next(err);
    }
  })

router.post("/resend", async(req, res) => {
  try {

    generateOTP()
    const emailContent = `
    <h1>OTP Verification</h1>
    <p>Hello</p>
    <p>Your OTP: <strong>${otp}</strong></p>
    <p>Please use this OTP to complete the verification process.</p>
    <p>Thank you!</p>
  `;
  
  await sendEmail(req.body.email, 'OTP Verification', emailContent)
  res.status(200).json("Success")
  } catch (error) {
    next(error)
  }
})


router.post("/verify/:id", async(req, res) => {
  const id = req.params.id
  const otpBody = req.body.otp

  try {
    if(parseInt(otp) === parseInt(otpBody)){
      otp = null; // reset the OTP value
      await User.findByIdAndUpdate(id, { isVerified: true });
      return res.status(200).send({ msg: 'Verify Successsfully!'})
  }
  return res.status(400).send({ error: "Invalid OTP"});
  } catch (error) {
    next(error)
  }
})



router.post("/protected", verifyToken, async(req, res) => {
    res.clearCookie("access_token")
    req.cookies["access_token"] = "";
    const token = jwt.sign({ id: req.user.id, isAdmin: req.user.isAdmin
    }, "123", {
      expiresIn: "1296000s",
    });
    res.cookie("access_token", token, {
      expires: new Date(Date.now() + 1296000000), // 30 seconds
      httpOnly: true,
      sameSite: 'None',
      secure: true
    });
    return res.json("Success")
})

module.exports = router