const express = require('express');
const auth = require('./src/auth');
const token = require('./src/token');
const plTool = require('./src/play-lists')
const sc = require('./src/soundcloud')
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/registration', (req, res) => {
    let {login, password} = req.body;
    auth.reg(login, password, (err, user) => {
        if (!err) {
            res.send({ success: true, token: token.createToken(user._id) });
        } else {
            res.send({ success: false, msg: err})
        }
    });
});

app.get('/api/login', (req, res) => {
    let { _id, password } = req.body;
    auth.login(_id, password, (err, result) => {
        if(!err && result){
            res.send({ success: true, token: token.createToken(_id) });
        } else if (!err && !result) {
            res.send({ success: false, msg: 'Incorect login or password' })
        } else {
            res.send({ success: false, msg: 'Server error' })
        }
    })
})

app.post('/api/add-to-library', (req, res) => {
    let { userToken, url, platform, name } = req.body;
    let _id = token.checkToken(userToken).id
    if (_id) {
        console.log(_id);
        plTool.addToLibrary(_id, url, name, platform)
        res.send({ success: true })
    } else {
        res.send({ success: false, msg: 'Incorect token' })
    }
})

app.get('/api/play', (req, res) => {
    let URL = "https://soundcloud.com/nikerrrrrr/shnurki"
    sc.streamURL(URL, (stream) => {
        stream.pipe(res)
    })
});

app.get('/api/library', async (req, res) => {
    let { _id, startFrom, endAt } = req.body;
    let lib = await plTool.getLibrary(_id)
    console.log(lib);
    if (endAt && startFrom){
        endAt = lib.length - endAt
        if (endAt > 0) {
            lib = lib.slice(startFrom, endAt)
            res.send(lib)
        } else {
            lib = lib.slice(startFrom)
            res.send(lib)
        }
    } else{
        res.send(lib)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });