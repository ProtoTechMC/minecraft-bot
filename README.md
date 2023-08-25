# minecraft-bot

A Minecraft bot implementation for vanilla access

### Run it using docker:

```bash
docker container run -d --restart always \
  -e HOST="my.minecraftserver.com" \
  -e PORT=25565 \
  -e USERNAME="ign" \
  -e PASSWORD="my-password" \
  -e AUTH="mojang" \
  -e VERSION="1.12" \
  prototechmc/minecraft-bot
```
