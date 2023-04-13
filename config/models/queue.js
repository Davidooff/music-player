let { mongoose, Schema} = require('../db')

const queueSchema = new Schema(
    {
        _id: String, //guild id
        channelId: String,
        msgID: String,
        channelID: String,
        queue: [
            {
                originalName: String,
                platform: String,
                link: String,
            }
        ]
    },
    {
        methods: {
            async moveInQueue(id, nextPosition){
                await mongoose.model('Queue').update(
                    {_id: this._id},
                    {$push: {
                        arr: {
                            $each: [{_id: id}],
                            $position: nextPosition
                        }
                    }
                })
                console.log(this);
            }
        }
    }
)

const QueueModel = mongoose.model('Queue', queueSchema);

module.exports = QueueModel;