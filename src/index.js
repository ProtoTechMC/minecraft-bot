const mineflayer = require("mineflayer");

const {
  HOST: host = "localhost",
  PORT: port = 25565,
  USERNAME: username,
  PASSWORD: password,
  AUTH: auth = "mojang",
  VERSION: version = false,
} = process.env;

console.log({ password, username })

var bot = mineflayer.createBot({
  host,
  port,
  username,
  password,
  auth, // optional; by default uses mojang, if using a microsoft account, set to 'microsoft'
  version,
});


const commands = {
  kill: () => bot.end()
}

const notFound = () => bot.chat("I don't understand")

bot.on('chat', (username, message) => {
  if(username === bot.username) return;
  if(message.startsWith(`!bot ${bot.username} kill`)){
    const [ _, _u, command, ...args] = message.split(' ');
    (commands[command] || notFound)(args);
  }
});
