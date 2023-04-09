const express = require('express')
const registration = require('./src/registration')
const token = require('./src/token')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/registration', (req, res) => {
    let {login, password} = req.body;
    registration.reg(login, password, (err, user) => {
        if (!err) {
            res.send({token: createToken(user._id)})
        }
    })
  })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })