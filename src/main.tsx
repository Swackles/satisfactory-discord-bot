import 'dotenv/config'
import {SatisfactoryRepository} from "./SatisfactoryRepository";
import {Client, EmbedBuilder, Events} from "discord.js";
import cron from "node-cron"

const discord = new Client({ intents: [] })
const satisfactory = new SatisfactoryRepository()

discord.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

cron.schedule(process.env.SCHEDULE_SEND_SAVE as string,async () => {
  if (!discord.isReady()) throw new Error("Client is not ready")

  const channel = await discord.channels.fetch(process.env.DISCORD_CHANNEL_ID as string)

  if (channel === null || !channel.isTextBased || !channel.isSendable()) throw new Error("Channel is not a text channel or cannot send messages")

  const latestSave = await satisfactory.getLatestSave((await satisfactory.getServerState()).activeSessionName)

  if (!latestSave) throw new Error("No save found")

  const embed = new EmbedBuilder()
    .setColor("#f7e200")
    .addFields(
      { name: 'Saved on', value: latestSave.saveDateTime.toUTCString() },
      { name: 'Time played', value: latestSave.playDurationString, inline: true },
    )

  await channel.send({
    files: [{
      attachment: await satisfactory.downloadSave(latestSave.saveName),
      name: `${latestSave.saveName}.sav`
    }],
    embeds: [embed]
  })

})

discord.login();
