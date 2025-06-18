import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import sqlite from 'sqlite'
import fs from 'fs';
import Logger from './logger'
import Module from './module';

const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const logger = new Logger("pushCommands")

let commands: SlashCommandBuilder[][] = [];

logger.info("Loading modules...")
let dir = fs.readdirSync("./modules");
for (let i = 0; i < dir.length; i++) {
    let mod = require("./modules/" + dir[i]);
    let modClass = new mod.default()
    modClass.logger = new Logger("main");
    commands.push(modClass.getCommands())
}
logger.info(`Loaded ${commands.length} modules.`);

let commandsInline: SlashCommandBuilder[] = [];
for (let i = 0; i < commands.length; i++) {
    for (let j = 0; j < commands[i].length; j++) {
        commandsInline.push(commands[i][j]);
    }
}
logger.info(`Pushing ${commandsInline.length} commands to Discord...`);

const rest = new REST().setToken(config.token);
(async () => {
	try {
		await rest.put(
			Routes.applicationCommands(config.clientId),
			{ body: commandsInline },
		);

		logger.info(`Successfully reloaded ${commandsInline.length} application commands.`);
	} catch (error) {
		logger.error(error);
	}
})();