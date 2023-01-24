const passwordValidator = require('password-validator');
const validPassword = new passwordValidator();
validPassword
    .is().min(8)
    .is().max(20)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .not().spaces();

const validName = (name) => /^[a-zA-Z ]{3,20}$/.test(name);

const validUserName = (userName) => (/^[a-zA-Z1-9]{6,20}$/).test(userName);

const validtitle = (name) => /^[a-zA-Z ]{3,20}$/.test(name);

const validLocation = (mail) => /^$/.test(mail);


module.exports = { validName, validUserName, validPassword, validtitle,validLocation };
