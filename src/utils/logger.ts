import chalk from "chalk";

type Color = (text: string) => string;

const line = (name: string, color: Color) => ({
	log: (message: string, ...data: unknown[]) => console.log(tag(name, color), message, ...data),
	error: (message: string, ...data: unknown[]) => console.error(tag(name, chalk.red), message, ...data),
});

const tag = (name: string, color: Color) => `(${color(name)})`;

export const logger = {
	app: line("app", chalk.blue),
	discord: line("discord", chalk.cyan),
	command: line("command", chalk.magenta),
	db: line("db", chalk.green),
};
