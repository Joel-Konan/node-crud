const { findById, findOne } = require('../models/blog');
const blogModel = require('../models/blog');


//Creation d'un nouveau blog
exports.createBlog = async (req, res) => {
    try {
        const {title, description} = req.body;
        let errors = [];
        let image;
        console.log(req.body);
        if(!title || !description){
            errors.push({message: "Veuillez ajouter un titre ou une description à ce blog!"})
        }

        if(req.file){
            image = req.file.filename
            console.log(req.file);
        }

        if(errors.length > 0){
            res.render('create_blog', {errors, title, description, image})
        }else{
            
            let newBlog = new blogModel({...req.body, image})
            newBlog.save();
            req.flash('success_msg', "Nouveau blog ajouté!")
            res.redirect('/')
        }

    } catch (error) {
        res.render('500', {error: error.message})
    }
    
}

//Récuperation de tout les blogs depuis la Base de donnée
exports.getAllBlogs = async (req, res) => {
    await blogModel.find().then((theBlogs) =>{
        if (theBlogs) {
            return res.render('index', {theBlogs})
        }else{
            return res.render('index')
        }
    })
}

//Récuperation du blog que l'on souhaite modifier
exports.getBlogToUpdate = async (req, res) => {
    try {
        if (res.locals.user) {
            const id_blog = req.params.id
            const {prenom} = res.locals.user
            let blog = await blogModel.findOne({ _id: id_blog })
                
            if(!blog){
                req.flash('error_msg', "Blog non trouvé!")
                redirect('/');
            }else{
                req.session.updateBlog = blog
                console.log(blog.image);
                return res.render('edit_blog', {id_blog, prenom, blog: req.session.updateBlog})
            }
            
        }else{
            req.flash('error_msg', "Connectez vous d'abord!")
            return res.redirect('/user/login')
        }
    } catch (error) {
        return res.render('500', { error: error.message })
    }
}

//Modification du Blog

exports.updateBlog = async (req, res) => {
    try {
        if(res.locals.user){
            let image;
            let errors = [];
            const id = req.params.id;
            const {prenom} = res.locals.user

            if(!req.body.title){
                errors.push({ message: "Un titre est obligatoire !" })
            }

            if(req.file){
                image = req.file.filename
            }else{
                errors.push({message: 'Veuillez ajouter une image SVP!'})
            }

            if(errors.length > 0) {
                res.render('edit_blog', {errors, prenom, blog: req.session.updateBlog})
            }else{
                blogModel.findById(id, async (err, blog) => {
                    if(err) return console.log(err);
                    if(blog){
                        console.log('le blog', blog);
                        
                        blog.title = req.body.title;
                        blog.description = req.body.description;
                        blog.image = image;

                        console.log('le blog', blog);
                        
                        blog.save(err =>{
                            if(err) return console.log(err);

                            req.flash('success_msg', 'Blog modifié avec succès');
                            return res.redirect('/');
                        })
                    }else{
                        console.log("Blog non trouvé");
                    }
                })

            }
        }else{
            req.flash('error_msg', "Connectez vous d'abord!")
            return res.redirect('/user/login')
        }
    } catch (error) {
        return res.render('500', { error: error.message })
    }
}


//Supression d'un blog
exports.deleteBlog = async(req, res) => {
    try {
        let id = req.params.id
        await blogModel.findByIdAndRemove({ _id: id }, (err, blog) => {
            if (err) {
                return res.render('500', { error: err.message })
            } else {
                req.flash('success_msg', 'Blog supprimée avec succès!')
                res.redirect('/')
            }
        })
    } catch (error) {
        return res.render('500', { error: error.message })
    }
}
