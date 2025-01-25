# Satisfactory Discord Bot

This bot takes the latest save from the currently running game and uploads it to a discord channel.

## Setup

First set up your own discord bot and get the token. This can be done by following the instructions [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html). Important to note that when setting up permissions, make sure the bot can send messages.

Next, you need to get the channel ID of the channel you want the bot to send messages to. This can be done by right-clicking on the channel and selecting "Copy ID".

Finally, you need to get the IP address and port of the satisfactory server. This can be done by opening the console and typing in `server.GenerateAPIToken`.

Then you can run the bot using docker compose

```yaml
services:
  satisfactory-bot:
    image: 'ghcr.io/swackles/satisfactory-discord-bot:latest'
    environment:
      - SERVER_IP=
      - SERVER_PORT=7777
      - SERVER_TOKEN=
      - DISCORD_TOKEN=
      - DISCORD_CHANNEL_ID=
      - SCHEDULE_SEND_SAVE=* 0 * * * * # sends the save every 24 hours
    restart: unless-stopped
```

## Environment Variables

| Variable           | Description                                                                       |
|--------------------|-----------------------------------------------------------------------------------|
| SERVER_IP          | IP address or hostname of the satisfactory server                                 |
| SERVER_PORT        | Port of the satisfactory server                                                   |
| SERVER_TOKEN       | Satisfactory auth token, can be generated using `server.GenerateAPIToken` command |
| DISCORD_TOKEN      | Discord bot's auth token                                                          |
| DISCORD_CHANNEL_ID | ID of the channel where you want the game save to be sent                         |
| SCHEDULE_SEND_SAVE | Cron schedule for sending the save file. More info [here](https://crontab.guru)   |
