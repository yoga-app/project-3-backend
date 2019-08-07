const express   = require('express');
const router    = express.Router();
const User      = require('../models/User');
const bcrypt    = require('bcryptjs');
const passport  = require('passport');
const uploadMagic = require('../config/cloudinary');
const nodemailer = require('nodemailer')


let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAILEMAIL,
    pass: process.env.GMAILPASS 
  }
});


router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  

  if (!username || !password) {
    res.status(400).json({ message: 'Provide username and password' });
    return;
  }

    // uncomment before deploying:

    //   if(password.length < 7){
    //       res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
    //       return;
    //   }

  User.findOne({ username }, (err, foundUser) => {

      if(err){
          res.status(500).json({message: "Username check went bad."});
          return;
      }

      if (foundUser) {
          res.status(400).json({ message: 'Username taken. Choose another one.' });
          return;
      }

      const salt     = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      const aNewUser = new User({
          username:username,
          password: hashPass,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          isAdmin: req.body.isAdmin || false,
          
      });

      aNewUser.save(err => {
          if (err) {
              res.status(400).json({ message: 'Saving user to database went wrong.' });
              return;
          }

          transporter.sendMail({
            from: 'DONOTREPLY@KukeeBlissYoga.com',
            to: username, 
            subject: 'Thank you for signing up', 
            text: 'WOW, you actually dont even have a computer. check your beeper for details',
            html: `<h4>${req.body.firstName}</h4>
            <p> Thank you for signing up for an account with Kukee Bliss Yoga </p>
                <p>I'm looking forward to seeing you in class!</p>
                <p>Valeria</p>
            `
          }).then(info => {
    
            console.log(info)
            console.log('Welcome email sent');
            
          
          })
          .catch(error => console.log(error))
          
          req.login(aNewUser, (err) => {
              if (err) {
                  res.status(500).json({ message: 'Login after signup went bad.' });
                  return;
              }
              res.status(200).json(aNewUser);
          });
      });
  });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
        if (err) {
            res.status(500).json({ message: 'Something went wrong authenticating user' });
            return;
        }
    
        if (!theUser) {
            res.status(401).json({message: "Login or password not found", details: failureDetails});
            return;
        }
  
        req.login(theUser, (err) => {
            if (err) {
                res.status(500).json({ message: 'Session save went bad.' });
                return;
            }
  
            res.status(200).json(theUser);
        });
    })(req, res, next);
  });

router.post('/logout', (req, res, next) => {
    req.logout();
    res.status(200).json({ message: 'Log out success!' });
});

router.get('/getcurrentuser', (req, res, next) => {
    if (req.user) {
        let newObject = {};
        // add first name and last name to use in welcome message
        newObject.username = req.user.username;
        newObject._id = req.user._id;
        newObject.firstName = req.user.firstName;
        newObject.lastName = req.user.lastName;
        newObject.picture = req.user.picture;
        newObject.subscription = req.user.subscription;
        newObject.package = req.user.package;
        newObject.created_at = req.user.created_at;
        newObject.isAdmin = req.user.isAdmin;
        newObject.level = req.user.level;

        User.findById(newObject._id)
        .populate('favoritedItems')
        .populate('daily.routine')
        .then(user=> {
            newObject.favoritedItems = user.favoritedItems;
            newObject.daily = user.daily;
            res.status(200).json(newObject);
        })
        .catch(err=> {
            res.json(err)
        })
    } else {

        res.status(403).json({ message: 'Unauthorized' });
    }
});

router.post('/updateuserinfo/:id', uploadMagic.single('picture'), (req, res, next) => {
    if(req.file) {req.body.picture = req.file.url}
    User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then((updatedUser)=> {
        res.json({updatedUser: updatedUser, message: 'User info updated successfully'})
    })
    .catch(err=> {
        res.status(500).json({message: `Something went wrong updating user`})
    })
})

router.post('/updateuserpackage/:id', (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, {
    'package.status': req.body.status,
    'package.classesLeft': req.body.classesLeft,
    'package.type': req.body.type
    }, {new: true})
    .then((updatedUser)=> {
        res.json({message: "We will reach out to you shortly. Make sure your contact information is correct!", updatedUser: updatedUser})
    })
    .catch(err=> {
        res.status(500).json({message: "Something went wrong updating user package"})
    })
})

router.post('/updatefavorited/:id', (req, res, next) => {
    if(req.body.direction == 'add') {
      User.findByIdAndUpdate(req.params.id, {
        $push: {favoritedItems : req.body.itemID}
      }, {new: true})
      .then(response => {
        res.json({message: 'Added to favorited successfully', updatedUser: response})
      })
      .catch(err =>{
        res.status(500).json({message: 'Something went wrong updating user'})
      })
  }
  else if (req.body.direction == 'remove') {
    User.findByIdAndUpdate(req.params.id, {
      $pull: {favoritedItems : req.body.itemID}
    }, {new: true})
    .then(response => {
      res.json({message: 'Removed from favorited successfully', updatedUser: response})
    })
    .catch(err =>{
      res.status(500).json({message: 'Something went wrong updating user'})
    })
  }
  })

router.post('/deleteprofile/:id', (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
    .then(()=> {
        res.status(200).json({message: `Profile deleted`})
    })
    .catch(err=> {
        res.status(500).json({message: `Something went wrong deleting the profile`})
    })
})

router.get('/getuserbyid/:id', (req, res, next) => {
    User.findById(req.params.id)
    .populate('favoritedItems')
    .populate('daily.routine')
    .then((user)=> {
        res.json(user)
    })
    .catch(err=> {
        res.status(500).json({message: 'Something went wrong finding user by id'})
    })
})

router.get('/getallusers', (req, res, next) => {
    User.find()
    .then(allUsers => {
        res.json(allUsers)
    })
    .catch(err => {
        res.status(500).json({message: 'Something went wrong geting all users'})
    })
})

router.post('/forgot-pass', (req, res, next)=>{

    User.findOne({username: req.body.email})
    .then((theUser)=>{

        transporter.sendMail({
          from: 'DONOTREPLY@KukeeBlissYoga.com',
          to: req.body.email, 
          subject: 'You Requested to Reset Your Password', 
          text: 'WOW, you actually dont even have a computer. check your beeper for details',
          html: `<p> Thank you for using our password reset feature.  If you did not 
          request this action please go to www.yougothacked.com to for more info
          please use the following link to reset your password 
          <a href="http://localhost:3000/forgot-password-update/${theUser._id}">Reset Password</a>
          `
        })
        .then((info)=>{
            console.log(info)
            console.log('Password reset email sent');
        })
        .catch((err)=>{
          next(err)
        })
  })
  })

  router.post('/password-reset/:id', (req, res, next) => {
    let password = req.body.password

    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    User.findByIdAndUpdate(req.params.id, {
        password: hashPass
    })
    .then(response => {
        res.json({message: 'Password updated successfully'})
    })
    .catch(err => {
        console.log(err);
    })
  })

  router.post('/update-daily-routine/:id', (req, res, next) => {
      User.findByIdAndUpdate(req.params.id, {
        'daily.routine' : req.body.routine,
        'daily.description' : req.body.description,
      }, {new: true})
      .then(response => {
          res.json({message: "Daily routine updated successfully", updatedUser: response})
      })
      .catch(err => {
          console.log(err);
        res.status(500).json({message: "Something went wrong updating daily routine"})
      })
  })

  router.post('/update-daily-routine-for-all/', (req, res, next) => {
      User.updateMany({}, {
        'daily.routine' : req.body.routine,
        'daily.description' : req.body.description,
      }, {new: true})
      .then(response => {
          res.json({message: "Daily routine updated successfully", updatedUsers: response})
      })
      .catch(err => {
          console.log(err);
        res.status(500).json({message: "Something went wrong updating daily routine"})
      })
  })



module.exports = router;