const request = require('request-promise');
const appendQuery = require('append-query');
var { google } = require('googleapis'),
    youtubeV3 = google.youtube({ version: 'v3', auth: 'AIzaSyA_y07l0mj5--7sojP6ZQrHTwh31jOo4y0' });

//api javascript AIzaSyA_y07l0mj5--7sojP6ZQrHTwh31jOo4y0
// api 


module.exports = {
    getVideos: getVideos
};

function getVideo(url) {
    return request(url)
        .then(JSON.parse)
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getVideos(req, res, next) {
    const name = req.params.name;
    var request = youtubeV3.search.list({
        part: 'snippet',
        type: 'video',
        q: name,
        maxResults: 10,
        safeSearch: 'moderate',
        videoEmbeddable: true
    }, (err, response) => {
        let thumbnails = [];
        for (var elt in response.data.items) {
            const item = response.data.items[elt];
            thumbnails.push({
                id: item.id.videoId,
                url:item.snippet.thumbnails.default.url,
                titles: item.snippet.title
            });
        }
        res.json(thumbnails);
    });
}