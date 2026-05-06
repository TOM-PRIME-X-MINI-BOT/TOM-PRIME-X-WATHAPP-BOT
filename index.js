/**
 * WhatsApp MD Bot - Main Entry Point
 * System: STYLISH UI + AUTO-PAIRING + AUTO SUCCESS MSG
 * Author: Professor Tom (ToxRon)
 */

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const config = require('./config');
const handler = require('./handler');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(`./${config.sessionName}`);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.ubuntu("Chrome"), 
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
    },
    syncFullHistory: false,
    markOnlineOnConnect: true
  });

  // --- PAIRING CODE LOGIC ---
  if (!sock.authState.creds.registered) {
    const phoneNumber = config.ownerNumber[0].replace(/[^0-9]/g, '');
    
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(phoneNumber);
        console.log(`\n\x1b[1m\x1b[36m🔄 Connecting to WhatsApp...\x1b[0m`);
        console.log(`\x1b[1m\x1b[33m📠 Pairing Request for: ${phoneNumber}\x1b[0m`);
        console.log(`\x1b[42m\x1b[30mYour Pairing Code :\x1b[0m \x1b[1m${code}\x1b[0m\n`);
        console.log(`Instructions:`);
        console.log(`1. Open WhatsApp\n2. Linked Devices > Link a Device\n3. Select 'Link with phone number instead'\n4. Enter the code above\n`);
      } catch (err) {
        console.error('Pairing Error:', err);
      }
    }, 6000); 
  }

  // --- CONNECTION UPDATE ---
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log(`\n\x1b[1m\x1b[34m      [ TOM PRIME X BOT ]\x1b[0m`);
      console.log(`\x1b[36m< =========================================== >\x1b[0m`);
      console.log(`\x1b[35m • YT CHANNEL: SAYCO TOM\x1b[0m`);
      console.log(`\x1b[35m • GITHUB: TOM-PRIME-X\x1b[0m`);
      console.log(`\x1b[35m • WA NUMBER: ${config.ownerNumber[0]}\x1b[0m`);
      console.log(`\x1b[32m • 🤖 Bot Connected Successfully! ✅\x1b[0m`);
      console.log(`\x1b[34mBot Version: 3.0.7\x1b[0m`);
      console.log(`\x1b[36m< =========================================== >\x1b[0m\n`);

      // --- AUTO SUCCESS MESSAGE IN WHATSAPP ---
      const myJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const successMsg = {
        text: `*🤖 TOM PRIME X BOT Connected Successfully!*\n\n` +
              `*⏰ Time:* ${new Date().toLocaleString()}\n` +
              `*✅ Status:* Online and Ready!\n\n` +
              `*🔗 GitHub:* https://github.com/TOM-PRIME-X/TOM-PRIME-X-BOT\n` +
              `*📺 YouTube:* https://youtube.com/@saycotom\n\n` +
              `*🚀 Powered by TOM PRIME X*`,
        contextInfo: {
          externalAdReply: {
            title: "TOM PRIME X BOT",
            body: "Engineered by Professor Tom (ToxRon)",
            sourceUrl: "https://github.com/TOM-PRIME-X/TOM-PRIME-X-BOT",
            mediaType: 1,
            renderLargerThumbnail: true,
            thumbnailUrl: "https://github.com/TOM-PRIME-X.png" 
          }
        }
      };
      await sock.sendMessage(myJid, successMsg);
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // --- MESSAGE UPSERT ---
  sock.ev.on('messages.upsert', ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      if (!msg.message || msg.key.remoteJid === 'status@broadcast') continue;
      handler.handleMessage(sock, msg).catch(err => console.log(err));
    }
  });

  return sock;
}

startBot();
