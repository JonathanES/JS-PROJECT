const db = require('./index');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

module.exports = {
    getAllFavorite: getAllFavorite,
    getSingleFavorite: getSingleFavorite,
    createFavorite: createFavorite,
    removeFavorite: removeFavorite
};

function getAllFavorite(req, res, next) {
    db.any('select * from t_favorite')
        .then(function (data) {
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

function getSingleFavorite(req, res, next) {
    const id = req.params.id;
    const id_user = req.params.id_user;
    db.one('select count(1) from t_favorite where id_videos = $1 and id_user = $2', [id,id_user])
        .then(function (data) {
            let bool = (data.count === "1") ? true : false;
            res.status(200)
                .json({
                    status: 'success',
                    data: bool,
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

async function checkFavorite(idUser, url) {
    return new Promise((resolve, reject) => {
        let count = 0;
        db.task(t => {
            return t.one('SELECT COUNT(1) as count FROM t_user where id = $1', idUser)
                .then(user => {
                    count = parseInt(user.count);
                    return t.any('select count(1) as count1 from t_favorite where id_user = $1 and id_videos = $2', [idUser, url]);
                })
                .then(elt => {
                    count += parseInt(elt[0].count1);
                    return t.any('SELECT COUNT(1) as count2 FROM t_history where url = $1', url);
                });
        }).then(events => {
            if (count == 2)
                resolve(false);
            count += parseInt(events[0].count2);
            if (count >= 2)
                resolve(true);
            else
                resolve(false);
            // success;
        }).catch(error => {
            resolve(false);
            // error;
        });
    });
}

function createFavorite(req, res, next) {
    const idUser = parseInt(req.body.iduser);
    const url = req.body.url;
    const prom = new Promise((resolve, reject) => {
        checkFavorite(idUser, url).then(function (value) {
            if (value != null)
                resolve(value);
            else
                reject(value);
        });
    });
    prom.then(function (check) {
        if (check) {
            db.none('insert into t_favorite(id_user,id_videos)' +
                'values(${iduser}, ${url})',
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
            res.status(403)
                .json({
                    status: 'Forbidden',
                    data: {},
                    message: ''
                });
    });
}

function removeFavorite(req, res, next) {
    const url = req.params.id;
    const id_user = req.params.id_user;
    db.result('delete from t_favorite where id_videos = $1 and id_user = $2', [url,id_user])
        .then(function (result) {
            res.status(200)
                .json({
                    status: "success",
                    message: "deleted single element in table t_videos"
                })
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
