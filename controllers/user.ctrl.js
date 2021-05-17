const userModel = require('../models/user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


//Inscription
exports.register = async (req, res) => {
    try {
        const {nom, prenom, email, password, confPass} = req.body;
        let errors = [];
        
        if(!nom || !prenom || !email || !password || !confPass){
            errors.push({message: "Veuillez remplir tout les champs"})
        }else if(!validateEmail(email)){
            errors.push({message: "Adresse mail invalid"})
        }else if(password.length < 8){
            errors.push({message: "Le mot de passe doit faire au moins 8 caractères"})
        }else if(password !== confPass){
            errors.push({message: "Les mot de passe saisi sont différent"})
        }

        if(errors.length > 0){
            res.render('register',  {errors, nom, prenom, email, password, confPass})
        } else{
            await userModel.findOne({email: email}).then((user)=>{
                if(user){
                    errors.push({message: "Cet email existe déjà!"})
                    res.render('register', {errors})
                }else{
                    let User = new userModel({...req.body})
                    hashPassword(User)
                    req.flash('success_msg', "Compte créer avec succès vous pouvez vous connecter!")
                    res.redirect('/user/login')
                }
            })
        }
    } catch (error) {
        res.render('500', {error: error.message})
    }
    
}

//Connexionx
exports.connexion = async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log(req.body);
        let errors = [];

        if(!email || !password){
            errors.push({message: "Veuillez remplir tout les champs!"})
        }
        if(errors.length > 0){
            res.render('login', {errors})
        }else{
            await userModel.findOne({email: email}).then((user)=>{
                if(user){
                    let isMatch = bcrypt.compareSync(password, user.password)
                    if(isMatch){
                        const refresh_token = createRefreshToken({id: user._id});
                        req.session.user = user;
                        
                        res.cookie('refreshtoken', refresh_token, {
                            httpOnly: true,
                            maxAge: 1 * 24 * 60 * 60 * 1000
                        })
                        req.flash('success_msg', "Connexion réussi !")
                        res.redirect('/');
                    }else {
                        req.flash('error_msg', 'Mot de passe incorrect')
                        res.redirect('/user/login')
                    }
                }else {
                    req.flash('error_msg', "Email ou Mot de passe incorrect")
                    res.redirect('/user/login')
                }
            })
        }
    } catch (error) {
        
    }
}

//Deconnexion
exports.deconnexion = async (req, res) => {
    try {
        if(req.session.user){
            delete req.session['user'];
            req.flash('success_msg', "Vous avez bien déconnecter")
            return res.redirect('/')
        }
        return res.redirect('/')
    } catch (error) {
        res.render('500', {errors: error.message})
    }
}

//Creation de jeton de connexion
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d'
    })
}

//Verifation de l'adresse mail
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//Cryptage du mot de passe
function hashPassword(User, password) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(User.password, salt, (err, hash) => {
            if (err) throw err;
            User.password = hash;
            User.save()
        });
    });
}