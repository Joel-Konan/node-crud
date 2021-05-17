const mongoose = require('mongoose');
const env = require('dotenv')
env.config();

try {
    mongoose.connect(process.env.MONGODB_ONLINE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(r => { console.log('DataBase Connected !!') })
} catch (err) {
    console.log('Une erreur est survenu lors de connexion à la bd', err.message);
}

module.exports = mongoose;