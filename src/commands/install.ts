import inquirer from "inquirer";
import type {Command} from "commander";

export default function (program: Command) {
    program
        .command('install')
        .description('install multiple modules at one')
        .action(() => {
            console.clear();
        })
}