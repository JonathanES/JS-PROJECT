//     

// $FlowFixMe
const moment = require('moment');

const db = require('./index');

// add query functions
// $FlowFixMe
module.exports = {
    getAllComment: getAllComment,
    getSingleComment: getSingleComment,
    getSingleCommentByUrl: getSingleCommentByUrl,
    createComment: createComment,
    updateComment: updateComment,
    removeComment: removeComment,
    removeAllComment: removeAllComment
};

function getAllComment(req, res, next) {
    db.any('select * from t_comment')
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

function getSingleComment(req, res, next) {
    const id = parseInt(req.params.id);
    db.one('select * from t_comment where id = $1', id)
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

function getSingleCommentByUrl(req, res, next) {
    const id = req.params.id;
    db.any('select id_videos, datepost, grade, comment, firstname, lastname from t_comment,t_user where t_comment.id_user = t_user.id and id_videos = $1', id)
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

async function checkComment(idUser, url) {
    return new Promise((resolve, reject) => {
        let count = 0;
        db.task(t => {
            return t.one('SELECT COUNT(1) as count FROM t_user where id = $1', idUser)
                .then(user => {
                    count = parseInt(user.count);
                    return t.any('SELECT COUNT(1) as count2 FROM t_videos where url = $1', url);
                });
        }).then(events => {
            count += parseInt(events[0].count2);
            if (count === 2)
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

function createComment(req, res, next) {
    const idUser = req.body.iduser;
    const url = req.body.url;
    const prom = new Promise((resolve, reject) => {
        checkComment(idUser, url).then(function (value) {
            if (value != null)
                resolve(value);
            else
                reject(value);
        });
    });
    prom.then(function (check) {
        if (check && req.body.grade) {
            db.none('insert into t_comment(id_user,id_videos,datepost,grade,comment)' +
                'values(' + idUser + ', ${url}' + ', now(), ${grade}, ${comment })',
                req.body)
                .then(function () {
                    res.status(200)
                        .json({
                            status: 'Success',
                            data: {},
                            message: 'inserted a comment a grade'
                        })
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
        else if (check && !req.body.grade) {
            db.none('insert into t_comment(id_user,id_videos,datepost,comment)' +
            'values(' + idUser + ', ${url}, now(), ${comment })',
            req.body)
                .then(function () {
                    res.status(200)
                        .json({
                            status: 'Success',
                            data: {},
                            message: 'inserted a comment'
                        })
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
            res.status(200)
                .json({
                    status: 'failure',
                    data: {},
                    message: 'videos not in the table'
                })
    });
}


function removeAllComment(req, res, next) {
    db.result('delete from t_comment')
        .then(function (result) {
            res.status(200);
            res.redirect('/models/comment');
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



function setQuery(body, id) {
    let str = "UPDATE T_COMMENT SET ";
    const size = str.length;
    for (let i in body) {
        const key = i;
        const val = body[i] + '';
        if (val != null && val != undefined)
            if (key == 'grade' || key == 'comment')
                str += key + " = '" + val.replace('\'', ' ') + "', ";
    }
    if (str != null && str.length > size)
        str = str.slice(0, -2);
    else
        return "can't update";
    str += " WHERE id = " + id;
    return str;
}


function updateComment(req, res, next) {
    const body = req.body;
    const id = parseInt(req.params.id);
    const resultat = setQuery(body, id);
    if (resultat !== "can't update") {
        db.none(resultat)
            .then(function () {
                res.status(200)
                    .json({
                        status: 'success',
                        message: 'Updated elt'
                    });
            })
            .catch(function (err) {
                res.status(403)
                    .json({
                        status: 'Forbidden',
                        message: err.details
                    });
            });
    }
    else
        res.status(404)
            .json({
                status: 'Not found',
                data: {}
            });
}

function removeComment(req, res, next) {
    const eltID = parseInt(req.params.id);
    db.result('delete from t_comment where id = $1', eltID)
        .then(function (result) {
            res.status(200);
            res.redirect('/models/comment');
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