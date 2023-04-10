const userModel = require('../config/models/user')

async function addToLibrary(id, url, name, platform){
    await userModel.updateOne(
        { _id: id }, 
        { 
            $push: { library: {
                'originalName': name,
                'link': url,
                'platform': platform
            }} 
        },
        { upsert: true }
    );
}

async function deleteFromLibrary(id, url, name, platform){
    await userModel.updateOne( // select your doc in moongo
        { _id: id }, // your query, usually match by _id
        { $pull: { library: { $elemMatch: { 
            'originalName': name,
            'link': url,
            'platform': platform
        } } } }, // item(s) to match from array you want to pull/remove
        { upsert: true }
    )
}

async function getLibrary(_id){
    let user = await userModel.findOne({'_id': _id}).lean()
    return user.library;
}

module.exports.addToLibrary = addToLibrary;
module.exports.deleteFromLibrary = deleteFromLibrary;
module.exports.getLibrary = getLibrary;