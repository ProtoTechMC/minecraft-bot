var mc = require("minecraft-protocol");

const {
  HOST: host = "localhost",
  PORT: port = 25565,
  USERNAME: username,
  PASSWORD: password,
  AUTH: auth = "mojang",
} = process.env;

var client = mc.createClient({
  host,
  port,
  username,
  password,
  auth, // optional; by default uses mojang, if using a microsoft account, set to 'microsoft'
});

client.on('chat', (_packet) => null);