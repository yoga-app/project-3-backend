const express   = require('express');
const router    = express.Router();
const User      = require('../models/User');
const bcrypt    = require('bcryptjs');
const passport  = require('passport');
const uploadMagic = require('../config/cloudinary');

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
          
      });

      aNewUser.save(err => {
          if (err) {
              res.status(400).json({ message: 'Saving user to database went wrong.' });
              return;
          }
          
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
            res.status(401).json(failureDetails);
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

        res.status(200).json(newObject);
        return;
    }
    res.status(403).json({ message: 'Unauthorized' });
});

router.post('/updateuserinfo/:id', uploadMagic.single('image'), (req, res, next) => {
    if(req.file.url) {req.body.picture = req.file.url}
    User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then((updatedUser)=> {
        res.json({updatedUser: updatedUser, message: 'User info updated successfully'})
    })
    .catch(err=> {
        res.status(500).json({message: `Something went wrong updating user`})
    })
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

module.exports = router;