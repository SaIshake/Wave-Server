const cloudinary = require("cloudinary").v2
          
cloudinary.config({ 
  cloud_name: 'dobudziej', 
  api_key: '194832541583422', 
  api_secret: 'yBIr3Xn8LrTO2lepOWe5INcoa-8' 
});

module.exports = cloudinary