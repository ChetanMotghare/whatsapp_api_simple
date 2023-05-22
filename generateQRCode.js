const { Client, LocalAuth } = require('whatsapp-web.js');
const qrImage = require('qr-image');
const { v4: uuidv4 } = require('uuid');

const sessions = require('./sessions');

async function generateQRCode(req, res) {
    const sessionId = uuidv4();

    const client = new Client({
        authStrategy: new LocalAuth({ clientId: sessionId }),
        puppeteer: {
           // executablePath: process.env.CHROME_BIN || 'google-chrome',
            //headless: true,
            args: ['--no-sandbox']
        }
    });

    client.on('qr', (qr) => {
        const qrCodeImage = qrImage.imageSync(qr, { type: 'png' });
      /*  const dataUrl = `data:image/png;base64,${qrCodeImage.toString('base64')}`;
        res.send({ sessionId, qrCodeImage: dataUrl });*/

         res.writeHead(200, { 'Content-Type': 'image/png' });
          res.end(qrCodeImage);
    });

    client.on('ready', () => {
        console.log('Session stored successfully', sessionId);
        sessions[sessionId] = { client: client };
    });

    await client.initialize();
}

module.exports = generateQRCode;

