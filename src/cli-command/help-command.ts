import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`
    ${chalk.green.bold('Программа для подготовки данных для REST API сервера.')}
        ${chalk.bgGreen('Пример:')}
        ${chalk.green('main.js --<command> [--arguments]')}

        ${chalk.bgGreen('Команды')}:
            ${chalk.green.underline('--version:')}                   ${chalk.green('# выводит номер версии')}
            ${chalk.green.underline('--help:')}                      ${chalk.green('# печатает этот текст')}
            ${chalk.green.underline('--import <path>:')}             ${chalk.green('# импортирует данные из TSV')}
            ${chalk.green.underline('--generate <n> <path> <url>')}  ${chalk.green('# генерирует произвольное количество тестовых данных')}
        `);
  }
}
