const repeat = require('../../src/repeat');

module.exports = function (app) {
    app.get('/repeat/:name', repeat.getVideos);
    /*app.get('/address.json', db.getAllAddressJson);
    app.get('/address/:id', db.getSingleAddress);
    app.post('/address', db.createAddress);
    app.put('/address/:id', db.updateAddress);
    app.delete('/address/:id', db.removeAddress);
    app.get('/address/delete/:id', db.removeAddress);*/
};