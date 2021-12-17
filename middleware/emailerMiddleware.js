const nodemailer = require("nodemailer");


module.exports.registerEmail =  async (req, res, next) => {
    const {email, username} = req.body; 
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.emailUsername, // generated ethereal user
        pass: process.env.emailPassword, // generated ethereal password
      },
    });
    let mailOptions = await transporter.sendMail({
        from: process.env.emailUsername, // sender address
        to: email, // list of receivers
        subject: "Welcome to bibliotech", // Subject line
        text: 
      `You successfully created a new a account with email : ${email}, and username : ${username},
        
      Stay safe, you deserve it!
  
      The Bibliotech Team`, // plain text body
      });

      transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
    });
}

module.exports.changedPasswordEmail =  async (req, res, next) => {
    const {email, username} = req.user; 
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.emailUsername, // generated ethereal user
        pass: process.env.emailPassword, // generated ethereal password
      },
    });
    let mailOptions = await transporter.sendMail({
        from: process.env.emailUsername, // sender address
        to: email, // list of receivers
        subject: "Password change", // Subject line
        text: 
      `You successfully changed your password at: ${email}, and username : ${username},
        If that wasn't you please reply to this email!

        Stay safe, you deserve it!
    
        The Bibliotech Team`, // plain text body
      });
      
      transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
    });
}

module.exports.forgotPasswordEmail =  async (req, res, next) => {
  const {email, username} = req.body; 
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
      user: process.env.emailUsername, // generated ethereal user
      pass: process.env.emailPassword, // generated ethereal password
    },
  });
  let mailOptions = await transporter.sendMail({
      from: process.env.emailUsername, // sender address
      to: email, // list of receivers
      subject: "Password reset", // Subject line
      text: 
      `You successfully reset your password at: ${email}, and username : ${username},
      Your temporary password is: '${req.temporaryPass}' , please login on the website and change it from the account settings at change password!
      If that wasn't you please reply to this email!

      Stay safe, you deserve it!
  
      The Bibliotech Team`, 
    });
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
  });
}








