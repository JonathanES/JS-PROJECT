//     
const db = require('./index');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

module.exports = {
    getAllVideos: getAllVideos,
    getSingleVideos: getSingleVideos,
    createVideos: createVideos,
    removeVideos: removeVideos
};

function getAllVideos(req, res, next) {
    db.any('select * from t_videos')
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

function getSingleVideos(req, res, next) {
    const id = parseInt(req.params.id);
    db.one('select * from t_videos where url = $1', id)
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
                    status: 'Forbidden',
                    data: { err },
                    message: err.message
                });
        });
}

function createVideos(req, res, next) {
    db.none('insert into t_videos(url,name)' +
        'values(${url}, ${name})',
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

function removeVideos(req, res, next) {
    const eltID = parseInt(req.params.id);
    db.result('delete from t_videos where id = $1', eltID)
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
