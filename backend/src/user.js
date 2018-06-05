//     
const db = require('./index');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

module.exports = {
    getAllUser: getAllUser,
    getSingleUser: getSingleUser,
    getSingleUserByEmail: getSingleUserByEmail,
    createUser: createUser,
    updateUser: updateUser,
    removeUser: removeUser
};

function getAllUser(req, res, next) {
    db.any('select * from t_user')
        .then(
            function (data) {
                data.forEach(function (element) {
                    element.password = element.password.replace(/\s/g, '');
                });
                res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'Retrieved ALL ELT'
                    });
            })
        .catch(function (err) {
            res.status(403)
                .json({
                    status: 'Forbidden',
                    data: { err },
                    message: err.message
                });
        });
}

function getSingleUser(req, res, next) {
    const id = parseInt(req.params.id);
    db.one('select * from t_user where id = $1', id)
        .then(function (data) {
            data.password = data.password.replace(/\s/g, '');
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ONE ELT'
                });
        })
        .catch(function (err) {
            res.status(403)
                .json({
                    status: 'Forbidden',
                    data: { err },
                    message: err.message
                });
        });
}

function getSingleUserByEmail(req, res, next) {
    const mail = req.params.email;
    const pwd = req.params.pwd;
    db.one('select * from t_user where email = $1', mail)
        .then(function () {
            db.one('select * from t_user where email = $1 and password = $2', [mail, pwd])
                .then(function (data) {
                    data.password = data.password.replace(/\s/g, '');
                    res.status(200)
                        .json({
                            status: 'success',
                            data: data,
                            message: 'Retrieved ONE ELT'
                        });
                }).catch(function (err) {
                    res.status(404)
                        .json({
                            status: 'password not found',
                            data: {},
                            message: 'Password not found'
                        });
                });
        })
        .catch(function (err) {
            res.status(404)
                .json({
                    status: 'mail not found',
                    data: {},
                    message: 'Mail not found'
                });
        });
}

async function checkUser(email) {
    return new Promise((resolve, reject) => {
        let count = 0;
        db.one('select count(1) as count from t_user where  Email  = $1;', email)
            .then(events => {
                count = parseInt(events.count);
                if (count === 1)
                    resolve(false);
                else
                    resolve(true);
                // success;
            })
            .then(function (data) {
                if (parseInt(data.count) === 0)
                    resolve(true);
                else
                    resolve(false);
            })
            .catch(function (err) {
            });
    });
}

function createUser(req, res, next) {
    let email = req.body.email;
    const prom = new Promise((resolve, reject) => {
        checkUser(email).then(function (value) {
            if (value != null)
                resolve(value);
            else
                reject(value);
        });
    });
    prom.then(function (check) {
        if (check) {
            //postMail(req.body, "create");
            //req.body.newpwd = req.body.newpwd;
            db.none('insert into t_user(email,password,pseudo)' +
                'values(${email}, ${password} , ${pseudo})',
                req.body)
                .then(function () {
                    res.status(200).json({
                        status: 'success',
                        data: {},
                        message: 'inserted one elt'
                    });
                })
                .catch(function (err) {
                    res.status(403)
                        .json({
                            status: 'Forbidden',
                            data: { err },
                            message: err.message
                        });
                });
        }
        else
            res.redirect('/models/user');
    });
}

function setQuery(body, id) {
    let str = "UPDATE T_USER SET ";
    const size = str.length;
    for (let i in body) {
        const key = i;
        const val = body[i];
        if (val != null && val != undefined)
            if (key == 'pseudo' || key == 'password')
                if (key == 'password')
                    str += key + " = '" + val + "', "
                else
                    str += key + " = '" + val + "', "
    }
    if (str != null && str.length > size)
        str = str.slice(0, -2);
    else
        return "can't update";
    str += " WHERE id = " + id;
    return str;
}

function updateUser(req, res, next) {
    const body = req.body;
    const id = parseInt(req.params.id);
    const resultat = setQuery(body, id);
    if (resultat !== "can't update") {
        if (body.password)
            postMail(body, "update");
        db.none(resultat)
            .then(function () {
                res.status(200)
                    .json({
                        status: 'success',
                        data: {},
                        message: 'Updated elt'
                    });
            })
            .catch(function (err) {
                res.status(403)
                    .json({
                        status: 'Forbidden',
                        data: { err },
                        message: err.message
                    })
                return next(err);
            });
    }
    else
        res.status(404)
            .json({
                status: 'Not found'
            });
}

function removeUser(req, res, next) {
    const eltID = parseInt(req.params.id);
    db.result('delete from t_user where id = $1', eltID)
        .then(function (result) {
            res.status(200);
            res.redirect('/models/user');
        })
        .catch(function (err) {
            res.status(404)
                .json({
                    status: 'Not found',
                    data: { err },
                    message: err.message
                });
        });
}
