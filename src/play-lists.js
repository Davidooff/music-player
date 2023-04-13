const userModel = require('../config/models/user')
const QueueModel = require('../config/models/queue')

async function addToQueue(id, url, name, platform){
    await QueueModel.updateOne(
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

async function shiftQueue(id){ // Geting queu by id of guild and returning next obj(music) in queu
    let queueObj = await QueueModel.findById(id).exec();
    queueObj.queue.shift();
    await queueObj.save()
    return queueObj.queue[0]
}

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
module.exports.addToQueue = addToQueue;
module.exports.shiftQueue = shiftQueue;
module.exports.addToLibrary = addToLibrary;
module.exports.deleteFromLibrary = deleteFromLibrary;
module.exports.getLibrary = getLibrary;