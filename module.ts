import { ChatInputCommandInteraction, Client, Interaction, SlashCommandBuilder } from "discord.js";
import Logger from "./logger";

class Module {
    name: string;
    description: string;
    logger: Logger

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
    getLogger() {
        return this.logger;
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