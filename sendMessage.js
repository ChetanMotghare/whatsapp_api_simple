const { Client, LocalAuth } = require('whatsapp-web.js');
const path = require('path');
const fs = require('fs');
const sessions = require('./sessions');

async function sendMessage(req, res) {
    const { sessionId, mobileNumbers, texts } = req.body;

    try {
        const sessionFolder = path.join(__dirname, '.wwebjs_auth', `session-${sessionId}`);
        const folderExists = await fs.promises.access(sessionFolder).then(() => true).catch(() => false);//session-bc884e18-7423-4399-8b74-ada70161f6d2

        if (!folderExists) {
            return res.status(401).send("Session not found. Please generate a QR code and login again.")
        }

        if (sessions[sessionId] && sessions[sessionId].client) {
            const client = sessions[sessionId].client;

            for (let i = 0; i < mobileNumbers.length; i++) {
                const mobileNumber = mobileNumbers[i];
                const text = texts[i];
                await client.sendMessage(`${mobileNumber}@s.whatsapp.net`, text);
            }
            res.status(200).send("Message Sent....")
        } else {
            console.log("client initialize")
            const client = new Client({
                authStrategy: new LocalAuth({ clientId: sessionId })
            });

            client.on('ready', () => {
                console.log('Session stored successfully', sessionId);

                // send messages
                for (let i = 0; i < mobileNumbers.length; i++) {
                    const mobileNumber = mobileNumbers[i];
                    const text = texts[i];
                    client.sendMessage(`${mobileNumber}@s.whatsapp.net`, text).catch(error => {
                        console.error(error);
                        res.status(401).json({ error: error.message });
                    });
                }

                sessions[sessionId] = { client };
                res.status(200).send("Message Sent....")
            });

            client.initialize();
        }

    } catch (error) {
        console.error(error);
        res.status(401).json({ error: error.message });
    }
}

module.exports.sendMessage = sendMessage;




