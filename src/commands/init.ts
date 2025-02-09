import inquirer from "inquirer";
import type {Command} from "commander";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(path.join(__dirname, "commands.json"), "utf8"));


export default function (program: Command) {
    program
        .command('init')
        .description('create a new nuxt project')
        .action(() => {
            console.clear();
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'projectName',
                        message: 'Project name?',
                        default: 'nuxt-project'
                    },
                    {
                        type: 'list',
                        name: 'moduleManager',
                        message: 'Which package manager would you like to use?',
                        choices: Object.keys(config.commandsManagers)
                    },
                    {
                        type: 'checkbox',
                        name: 'nuxtModules',
                        message: 'Install modules?',
                        choices: Object.keys(config.modules).map(key => ({
                            name: `Nuxt ${key.charAt(0).toUpperCase() + key.slice(1)}`,
                            value: key
                        }))
                    },
                    {
                        type: 'confirm',
                        name: 'confirmVersion',
                        message: 'version v4?',
                        default: false
                    }
                ])
                .then((answers) => {
                    const command = `${config.commandsManagers[answers.moduleManager]} nuxi@latest init ${answers.projectName} --packageManager ${answers.moduleManager} --gitInit -f`;
                    try {
                        execSync(command, { stdio: 'inherit' });
                        console.clear()
                        console.log(`✨Your project ${answers.projectName} has been created !`);

                        if(answers.nuxtModules.length > 0) {
                            answers.nuxtModules.forEach((e : string) => {
                                execSync(`cd ${answers.projectName} && ${config.commandsManagers[answers.moduleManager]} nuxi@latest module add ${e}`, { stdio: 'inherit' });
                            })
                        }
                    } catch (error) {
                        console.error("Erreur lors de l'initialisation du projet :", error);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de l'exécution des prompts :", error);
                });
        });
}