const db = require('../../src/videos');

module.exports = function (app) {
    app.get('/videos', db.getAllVideos);
    app.get('/videos/:id', db.getSingleVideos);
    app.post('/videos', db.createVideos);
    app.delete('/videos/:id', db.removeVideos);
};