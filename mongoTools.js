const db = require('./models')
const dotenv = require('dotenv');
global.mongoDB = {
    connect: function () {
        db.mongoose
            .connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => {
                console.log("Successfully connect to MongoDB.");
                //initial();
            })
            .catch(err => {
                console.error("Connection error", err);
                process.exit();
            });
    },
    getLastSequnceValue: function (seqName, cb) {
        db.counters.findByIdAndUpdate({_id: seqName}, {$inc: {sequence_value: 1}}, function (error, counter) {
            if (!error) {
                if (cb) cb(counter.sequence_value);
            } else {
                console.log(seqName, "Counters Error")
            }
        });
    }
}