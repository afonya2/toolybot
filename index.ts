import { ChatInputCommandInteraction, Client, Interaction, SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import Logger from './logger'
import Module from './module';
import sqlite3 from 'sqlite3';
import utils from './utils';

const TOOLYVERSION = '0.1.0'
const source = "https://github.com/afonya2/toolybot.git"
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const logger = new Logger("main")
const db = new sqlite3.Database("database.db")

const client = new Client({
    intents: []
})

let modules: Module[] = [];
let commands: SlashCommandBuilder[][] = [];

function loadModule(name: string) {
    let mod = require("./modules/" + name);
    let modClass = new mod.default()
    modClass.logger = new Logger("main");
    modClass.database = db;
    modules.push(modClass);
    commands.push(modClass.getCommands());
}

logger.info("Loading modules...")
let dir = fs.readdirSync("./modules");
for (let i = 0; i < dir.length; i++) {
    loadModule(dir[i]);
}
logger.info(`Loaded ${modules.length} modules.`);

client.once("ready", () => {
    logger.info(`Connected to Discord as ${client.user?.tag}`);
    for (let i = 0; i < modules.length; i++) {
        modules[i].activate(client)
    }
    logger.info(`Activated ${modules.length} modules.`);
    console.log()
    logger.info(`Tooly v${TOOLYVERSION}`);
    logger.info(`Documenation: TODO`);
    logger.info(`Source code: ${source}`)
})

function getCommandModule(cmd: ChatInputCommandInteraction): Module | undefined {
    for (let i = 0; i < commands.length; i++) {
        for (let j = 0; j < commands[i].length; j++) {
            if (commands[i][j].name == cmd.commandName) {
                return modules[i];
            }
        }
    }
}

async function runOnAllModules(func: string, ...args: any[]) {
    for (let i = 0; i < modules.length; i++) {
        let isEnabled = await utils.queryDB(db, `SELECT value FROM settings WHERE key = "modules.${modules[i].name}.enabled"`);
        if (isEnabled.length > 0 && isEnabled[0].value === "true") {
            if (typeof modules[i][func] === 'function') {
                modules[i][func](...args);
            } else {
                logger.warn(`Module ${modules[i].name} does not have function ${func}`);
            }      
        }
    }
}

client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
        let mod = getCommandModule(interaction);
        if (!mod) {
            logger.error(`Unknown command: ${interaction.commandName}`);
            return;
        }
        let isEnabled = await utils.queryDB(db, `SELECT value FROM settings WHERE key = "modules.${mod.name}.enabled"`);
        if (isEnabled.length > 0 && isEnabled[0].value === "true") {
            mod.onCommand(interaction);   
        }
    }
    runOnAllModules("onInteraction", interaction);
})

client.login(config.token)