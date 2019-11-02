
const AuthModel = require("../models/auth");
const bcrypt = require("bcryptjs");
const isAuthenticated = require("../controllers/products").isAuthenitcatedUsingSession;
const sgMail = require('@sendgrid/mail');
//creates secure unique random values
const crypto = require("crypto");



sgMail.setApiKey("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");


const getSignUp = (req, res, next)=>{

    isAuthenticated(req,res).then((data)=>{
        res.redirect('/');
     }).catch((err)=>{
        res.render('signup', {
            pageTitle: 'Signup to the Node App',
            signUpPage:true
        });
     });
    
};

const postSignUp = (req, res, next)=>{
   
    AuthModel.findByEmailId(req.body.email).then((user)=>{
        console.log(user);
        if(user){
            return res.status(200).json({ message: "User already exists" });
        }
        //hasing the password, with salt 12
        bcrypt.hash(req.body.password, 12).then((hashedPassword)=>{
            const user = new AuthModel({
                email: req.body.email,
                password: hashedPassword
            });
            user.save().then((data)=>{
                console.log(data, "is saved");
                // once signedup send an email to user
                const msg = {
                    to: 'gupta.amogh15@gmail.com',
                    from: 'gupta.amogh15@gmail.com',
                    subject: "Singup succeded",
                    html: '<h1>You have signed up successfully</h1>'
                };
                sgMail.send(msg);
                res.status(200).json({ message: "User created successfully" });
            }).catch((err)=>{
                console.log("ERROR SIGNING UP NEW USER: ",err);
            })
        });
    }).catch((err)=>{
        console.log("ERROR CONNECTING TO USER AUTH DB: ",err);
    })
    
};


const getLogin = (req, res, next)=>{

    isAuthenticated(req,res).then((data)=>{
       res.redirect('/');
    }).catch((err)=>{
        res.render('login', {
            pageTitle: 'Login in to Node App',
            loginPage:true,
            errorMessage: req.flash('error')
        });
    });

    
}

const postLogin = (req, res, next)=>{

    // Cookies = Client side data (stored in visitors browser)
    //setting the cookie to logged in 
    // res.cookie('loggedIn',"true", { 
    //     maxAge: 900000, 
    //     //basically it means you cannot set this cookie from Javascript
    //     httpOnly: true,
    //     // cookie will be only when server is https
    //     // secure: true
    // });


    // Sessions = Server side data (are stored on server)
    // The session is stored on the server but it needs a cookie to store an 
    // indicator of who is requesting the session value.
    //req.session.isLoggedIn = true;



    AuthModel.findByEmailId(req.body.email).then((user)=>{
        if(!user){
            // return res.status(200).json({ message: "Invalid login1" });
            req.flash("error", 'invalid email or password');
            return res.redirect("/login");
        }
        bcrypt.compare(req.body.password, user.password).then((doMatch)=>{
            if(!doMatch){
                req.flash("error", 'invalid email or password');
                return res.redirect("/login");
            }else{
                // if passwords match 
                // setting session to logged in and saving user info
                // saving the session in session storage on server 
                req.session.isLoggedIn = true;
                req.session.user = user.emailId;
                req.session.save();
                return res.redirect('/');
            }
        }).catch((error)=>{
            console.log("something went wrong1! ", error)
        });
    }).catch((error)=>{
        console.log("something went wrong2! ", error)
    });
}

const getLogout = (req, res, next)=>{
    req.session.destroy();
    return res.redirect("/login");
}

const getReset = (req, res, next)=>{
    res.render('reset', {
        resetPage:true,
        pageTitle: "Reset Password",
        errorMessage: req.flash('resetError')
    });
};


const postReset = (req, res, next)=>{
    crypto.randomBytes(32, (err, buffer)=>{
        if(err){
            console.log(err);
            return res.redirect("/reset");
        }
        const token = buffer.toString('hex');
        AuthModel.findByEmailId(req.body.email).then((user)=>{
            if(!user){
                req.flash("resetError", 'No such account.');
                return res.redirect("/reset");
            }

            AuthModel.updateUserRecord({
                email: req.body.email,
                resetToken: token,
                resetExpiration: Date.now() + 3600000
            }).then((data)=>{
                console.log("token saved");
                console.log(data);
                req.flash("resetError", 'Token sent to Email account.');
                // once signedup send an email to user
                const msg = {
                    to: 'gupta.amogh15@gmail.com',
                    from: 'gupta.amogh15@gmail.com',
                    subject: "Singup succeded",
                    html: '<h1>You have signed up successfully</h1>'
                };
                sgMail.send(msg);
                return res.redirect("/reset");
            }).catch((err)=>{
                console.log(err);
            })
        });
    })
};

const getNewPassword = (req, res, next)=>{
     const resetToken = req.params.resetToken;

     AuthModel.findUserByToken(resetToken).then((user)=>{
        if(!user){
            req.flash("resetError", 'No such User');
            return res.redirect("/reset");
        }
        res.render('newPassword', {
            newPasswordPage:true,
            pageTitle: "Welcome to New Password Page",
            errorMessage: req.flash('newPasswordError'),
            userId: user.emailId
        });
        
     }).catch((err)=>{
        req.flash("resetError", 'Invalid Token');
        return res.redirect("/reset");
     });

    
}

const postNewPassword = (req, res, next)=>{
    let newUserPassword = req.body.password;
    let emailId = req.body.userId;

    AuthModel.findByEmailId(emailId).then((user)=>{
        console.log(user);
        if(user){
            //hasing the password, with salt 12
            bcrypt.hash(newUserPassword, 12).then((hashedPassword)=>{
                AuthModel.updateUserPassword({
                    emailId: emailId,
                    password: hashedPassword
                }).then((data)=>{
                        console.log(data, "is saved");
                        req.flash("error", 'Password Updated');
                        return res.redirect("/login");
                    }).catch((err)=>{
                        req.flash("error", 'Failed to update password');
                        return res.redirect("/login");
                });
            });
        }
        
    }).catch((err)=>{
        console.log("ERROR CONNECTING TO USER AUTH DB: ",err);
    })
}



exports.postSignUp = postSignUp;
exports.getSignUp = getSignUp;
exports.getLogin = getLogin;
exports.postLogin = postLogin;
exports.getReset = getReset;
exports.postReset = postReset;
exports.getNewPassword = getNewPassword;
exports.postNewPassword = postNewPassword;
exports.getLogout = getLogout;
