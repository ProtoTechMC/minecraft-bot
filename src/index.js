const mineflayer = require("mineflayer");
const { actionable } = require("./actionable");

const {
  HOST: host = "localhost",
  PORT: port = 25565,
  USERNAME: username,
  PASSWORD: password,
  AUTH: auth = "mojang",
  VERSION: version = false,
} = process.env;

console.log({ password, username });

var bot = mineflayer.createBot({
  host,
  port,
  username,
  password,
  auth, // optional; by default uses mojang, if using a microsoft account, set to 'microsoft'
  version,
});

const getCords = (pos) => [
  Math.round(pos.x),
  Math.round(pos.y),
  Math.round(pos.z),
];

const commands = {
  kill: () => bot.quit(),
  hi: () => bot.chat("Hello!"),
  pos: () =>
    bot.chat(
      `(${getCords(bot.entity.position).join(", ")}) @ ${bot.game.dimension}`
    ),
  yp: () => bot.chat(`Yaw ${bot.entity.yaw}, Pitch: ${bot.entity.pitch}`),
  look: (yaw, pitch) => bot.look(Number(yaw) || 0, Number(pitch) || 0, true),
  mount: () => {
    const entity = bot.nearestEntity(
      (e) =>
        e.type == "object" && bot.entity.position.distanceTo(e.position) <= 5
    );
    if (!entity) return;
    bot.mount(entity);
  },
  dismount: () => bot.dismount(),
  stop: () => bot.clearControlStates(),
  attack: actionable(() => {
    const entity = bot.nearestEntity(
      (e) =>
        ["player", "mob"].includes(e.type) &&
        bot.entity.position.distanceTo(e.position) <= 10
    );
    if (!entity) return;
    bot.lookAt(entity.position);
    if (entity.position.distanceTo(bot.entity.position) > 5) return;
    bot.attack(entity);
  }),
  jump: actionable(
    () => bot.setControlState("jump", true),
    () => bot.setControlState("jump", false)
  ),
  sleep: actionable(() => {
    if (bot.isSleeping) return;
    if (bot.time.isDay && bot.thunderState == 0) return;
    const bed = bot.findBlock({
      maxDistance: 5,
      matching: (block) => block.name.toLowerCase().includes("bed"),
    });
    if (!bed) return;
    bot.sleep(bed);
  }),
  drop: (slot = "all") => {
    if (slot.toLowerCase() == "all")
      return bot.inventory.items().forEach((item) => bot.tossStack(item));
    const item = bot.inventory.slots[Number(slot) || 0];
    return bot.tossStack(item);
  },
};

const notFound = () => bot.chat("I don't understand");

bot.on("chat", (username, message) => {
  if (username === bot.username) return;
  if (message.startsWith(`!bot ${bot.username}`)) {
    const [_, _u, command, ...args] = message.split(" ");
    (commands[command] || notFound)(...args);
  }
});

bot.once("spawn", () => console.log(`${bot.username} logged in!`));

// Log errors and kick reasons:
bot.on("kicked", console.log);
bot.on("error", console.log);
