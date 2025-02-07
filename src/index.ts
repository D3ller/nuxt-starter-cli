import { Command } from "commander";
import { readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const program = new Command();

// @ts-ignore
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const commandFiles = readdirSync(join(__dirname, "commands"))
    .filter(file => file.endsWith(".ts") || file.endsWith(".js"));

for (const file of commandFiles) {
    const commandModule = await import(`./commands/${file}`);
    if (commandModule.default) {
        commandModule.default(program);
    }
}

program.parse(process.argv);

export default program;
