const moment = require('moment');
const db = require('./index');
// add query functions

module.exports = {
    getAllHistory: getAllHistory,
    getSingleHistory: getSingleHistory,
    getAllHistoryUser: getAllHistoryUser,
    removeHistory: removeHistory,
    removeHistoryByUserId: removeHistoryByUserId,
    removeAllHistory: removeAllHistory,
    createHistory: createHistory
};

function getAllHistory(req, res, next) {
    db.any('select * from t_history')
        .then(
            function (data) {
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
// $FlowFixMe
function getSingleHistory(req, res, next) {
    const id = parseInt(req.params.id);
    db.one('select * from t_history where id = $1', id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ONE ELT'
                });
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

// $FlowFixMe
function getAllHistoryUser(req, res, next) {
    const id = parseInt(req.params.id);
    db.any('select * from t_history where id_user = $1', id)
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Retrieved ONE ELT'
                });
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

async function checkHistory(idUser, idProduct) {
    return new Promise((resolve, reject) => {
        let count = 0;
        db.one('SELECT COUNT(1) as count FROM t_user where id = $1', idUser)
            .then(events => {
                count = parseInt(user.count);
                if (count === 1)
                    resolve(true);
                else
                    resolve(false);
                // success;
            })
            .catch(error => {
                // error;
            });
    });
}
// $FlowFixMe
function createHistory(req, res, next) {
    const idUser = parseInt(req.body.iduser);
    const url = req.body.url;
    const prom = new Promise((resolve, reject) => {
        checkHistory(idUser).then(function (value) {
            if (value != null)
                resolve(value);
            else
                reject(value);
        });
    });
    prom.then(function (check) {
        if (check) {
            db.none('insert into t_history'
                + ' values($1,' + idUser + ', now())', url)
                .then(function () {
                    res.status(200);
                    res.redirect('/models/history');
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
            res.redirect('/models/history');
    });
}

// $FlowFixMe
function removeHistory(req, res, next) {
    const eltID = req.params.id;
    if (!isNaN(eltID)) {
        db.result('delete from t_history where id = $1', eltID)
            .then(function (result) {
                res.status(200);
                res.redirect('/models/history');
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
}

// $FlowFixMe
function removeHistoryByUserId(req, res, next) {
    const eltID = parseInt(req.params.id);
    if (!isNaN(eltID)) {
        db.result('delete from t_history where id_user = $1', eltID)
            .then(function (result) {
                res.status(200);
                res.redirect('/models/history');
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
}

// $FlowFixMe
function removeAllHistory(req, res, next) {
    db.result('delete from t_history')
        .then(function (result) {
            res.status(200);
            res.redirect('/models/history');
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