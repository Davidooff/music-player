const userModel = require('../config/models/user')

function addToLibrary(_id, url, name, platform){
    userModel.update(
        { _id: _id }, 
        { 
            $push: { library: {
                'originalName': name,
                'link': url,
                'platform': platform
            }} 
        },
    );
}

function deleteFromLibrary(_id, url, name, platform){
    userModel.update( // select your doc in moongo
    { _id: _id }, // your query, usually match by _id
    { $pull: { library: { $elemMatch: { 
        'originalName': name,
        'link': url,
        'platform': platform
     } } } }, // item(s) to match from array you want to pull/remove
    { multi: false } // set this to true if you want to remove multiple elements.
)
}

module.exports.addToLibrary = addToLibrary;
module.exports.deleteFromLibrary = deleteFromLibrary;