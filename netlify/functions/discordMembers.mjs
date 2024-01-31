import { Client, GatewayIntentBits, Discord } from "discord.js";

export const handler = async (event, context) => {
    const TOKEN =
        "MTE5NTQzMzg3Mzk3NTI4NzgxOA.GEltfa.EqPcpu0FRSy2IozmYts8oEeGrp8TuFn5m5Cxx0";
    // const CLIENT_ID = process.env.VITE_DISCORD_CLIENT_ID;
    const GUILD_ID = "256654718275682305";
    // process.env.VITE_DISCORD_GUILD_ID;

    const client = new Client({
        intents: [GatewayIntentBits.Guilds],
    });

    try {
        await client.login(TOKEN);
        client.on("ready", async () => {});
        const guild = await client.guilds.fetch(GUILD_ID);
        return {
            statusCode: 200,
            body: JSON.stringify(guild),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error", error }),
        };
    }

    // try {
    //     await client.login(TOKEN);
    //     const guild = await client.guilds.fetch(GUILD_ID);

    //     let memberList = [];

    //     if (guild) {
    //         // console.log(guild);
    //         // guild.members.cache.forEach((member) => {
    //         //     memberList.push({
    //         //         username: member.user.tag,
    //         //         nickname: member.displayName,
    //         //         id: member.id,
    //         //     });
    //         // });
    //         return {
    //             statusCode: 200,
    //             body: JSON.stringify(guild),
    //         };
    //     } else {
    //         return {
    //             statusCode: 404,
    //             body: JSON.stringify({ message: "Guild not found" }),
    //         };
    //     }
    // } catch (error) {
    //     return {
    //         statusCode: 500,
    //         body: JSON.stringify({ message: "Internal server error", error }),
    //     };
    // } finally {
    //     await client.destroy();
    // }
};
