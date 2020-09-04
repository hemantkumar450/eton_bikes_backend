
let bcrypt = require('bcrypt');

// hash password for reg
exports.hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            bcrypt.hash(password, 10, (err, hashed) => {
                if (err) return resolve(null);
                return resolve(hashed)
            })
        } catch (e) {
            console.log(e)
            resolve(null)
        }
    })
}

exports.makePlural = (number, str, sufix) => {
    //to do make it work for ies as well
    if (number > 1) {
        return `${number} ${str}${sufix}`
    } else {
        return `${number} ${str}`
    }
}
