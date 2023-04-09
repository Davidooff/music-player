const scdl = require('soundcloud-downloader').default

function streamURL(URL, callback){
    scdl.download(URL).then(stream =>  {
        callback(stream)
    })
}

module.exports.streamURL = streamURL;