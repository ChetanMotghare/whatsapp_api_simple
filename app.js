require('dotenv').config();
const app = require('./server');
//const serverless = require('serverless-http');
const generateQRCode = require('./generateQRCode');
const { sendMessage } = require('./sendMessage');
const { logOut } = require('./logOut');

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/testInfo', (req, res) => {
     res.send("Test info using testInfo endpoint............")
})
app.get('/generateQRCode', generateQRCode);
app.post('/sendMessage', sendMessage);
app.post('/logOut', logOut);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});
/*if (process.env.ENVIRONMENT === 'production') {
    exports.handler = serverless(app);
} else {
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}.`);
    });
}*/






