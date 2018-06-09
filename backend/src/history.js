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
    createHistory: createHistory,
    getViewsByUser: getViewsByUser,
    getAllVideoViews: getAllVideoViews
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
                    data: {},
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
                    data: {},
                    message: err.message
                });
        });
}

// $FlowFixMe
function getAllHistoryUser(req, res, next) {
    const id = parseInt(req.params.id);
    db.any('select t_history.url as id_videos, t_history.thumbnail,name from t_history, t_videos where t_history.url = t_videos.url and id_user = $1', id)
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
                    data: {},
                    message: err.message
                });
        });
}

async function checkHistory(idUser, url) {
    return new Promise((resolve, reject) => {
        let count = 0;
        db.one('SELECT COUNT(1) as count FROM t_user where id = $1', idUser)
        .then(events => {
            count += parseInt(events.count);
            if (count === 1)
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


// $FlowFixMe
function createHistory(req, res, next) {
    const idUser = parseInt(req.body.iduser);
    const url = req.body.url;
    const thumbnail = req.body.thumbnail;
    const prom = new Promise((resolve, reject) => {
        checkHistory(idUser, url).then(function (value) {
            if (value != null)
                resolve(value);
            else
                reject(value);
        });
    });
    prom.then(function (check) {
        if (check) {
            db.none('insert into t_history'
                + ' values(default,$1,' + idUser + ', now(), $2)' , [url,thumbnail])
                .then(function () {
                    res.status(200);
                    res.redirect('/models/history');
                })
                .catch(function (err) {
                    res.status(403)
                        .json({
                            status: 'Forbidden',
                            data: {},
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
                        data: {},
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
                        data: {},
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
                    data: {},
                    message: err.message
                });
        });
}

function getViewsByUser(req, res, next) {
    const id_user = parseInt(req.params.iduser);
    const url = req.params.url;
    db.one('select count(1) from t_history where id_user = $1 and url = $2', [id_user, url])
        .then(function (data) {
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
                    status: 'failure',
                    data: {},
                    message: err.message
                });
        });
}

function getAllVideoViews(req, res, next) {
    const url = req.params.url;
    db.one('select count(1) from t_history where url = $1', url)
        .then(function (data) {
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
                    status: 'failure',
                    data: {},
                    message: err.message
                });
        });
}