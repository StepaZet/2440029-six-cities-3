import { Command } from './command.interface.js';

export class HelpCommand implements Command {
  public getName = (): string => '--help';

  public execute(..._parameters: string[]): void {
    console.info(`
    Программа для подготовки данных для REST API сервера.

    Пример: cli.js --<command> [--arguments]

    Команды:

    --version:                   # выводит номер версии
    --help:                      # печатает этот текст
    --import <path> <db_uri>:    # импортирует данные из TSV
    --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных
      `);
  }
}
