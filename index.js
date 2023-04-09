const express = require('express');
const registration = require('./src/registration');
const token = require('./src/token');
const plTool = require('./src/play-lists')
const sc = require('./src/soundcloud')
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/registration', (req, res) => {
    let {login, password} = req.body;
    registration.reg(login, password, (err, user) => {
        if (!err) {
            res.send({token: createToken(user._id)});
        }
    });
});

app.post('/api/add-to-library', (req, res) => {
    let { userToken, url, platform, name } = req.body;
    let _id = token.checkToken(userToken)
    if (_id) {
        plTool.addToLibrary(_id, url, name, platform)
    }
})

app.get('/api/play', (req, res) => {
    let URL = "https://soundcloud.com/nikerrrrrr/shnurki"
    sc.streamURL(URL, (stream) => {
        stream.pipe(res)
    })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });