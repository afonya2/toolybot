import { ChatInputCommandInteraction, Client, Interaction, SlashCommandBuilder } from 'discord.js';
import module from '../module'

class TestModule extends module {
    constructor() {
        super("TestModule", "This is a test module.");
    }
    activate(client: Client) {
        this.getLogger().info("TestModule activated.");
    }
    deactivate() {
        this.getLogger().info("TestModule deactivated.");
    }
    onCommand(interaction: ChatInputCommandInteraction) {
        interaction.reply({
            content: "Hah"
        })
    }
    onInteraction(interaction: Interaction) {
        
    }
    getCommands(): SlashCommandBuilder[] {
        return [
            new SlashCommandBuilder()
                .setName("test")
                .setDescription("This is a test command.")
        ]
    }
}

export default TestModule;