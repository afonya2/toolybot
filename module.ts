import { ChatInputCommandInteraction, Client, Interaction, SlashCommandBuilder } from "discord.js";
import Logger from "./logger";
import { Database } from "sqlite3";

class Module {
    name: string;
    description: string;
    logger: Logger
    database: Database

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
    getLogger() {
        return this.logger;
    }
    getDatabase() {
        return this.database;
    }
    activate(client: Client) {

    }
    deactivate() {

    }
    onCommand(interaction: ChatInputCommandInteraction) {

    }
    onInteraction(interaction: Interaction) {

    }
    getCommands(): SlashCommandBuilder[] {
        return [];
    }
}

export default Module;