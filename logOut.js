const path = require('path');
const fs = require('fs');
const sessions = require('./sessions');
async function logOut(req, res) {
    const { sessionId } = req.body;

    try {
        if (sessions[sessionId] && sessions[sessionId].client) {
            const client = sessions[sessionId].client;
            await client.destroy();
        }
        const sessionFolder = path.join(__dirname, '.wwebjs_auth', `session-${sessionId}`);
        await fs.promises.rm(sessionFolder, { recursive: true });
        delete sessions[sessionId];
        res.send('Logged out successfully. Thank you for using.');
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};


module.exports.logOut = logOut;




