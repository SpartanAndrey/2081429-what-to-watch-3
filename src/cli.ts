#!/usr/bin/env node

import 'reflect-metadata';
import GenerateCommand from './cli-command/generate-command.js';
import ImportCommand from './cli-command/import-command.js';
import HelpCommand from './cli-command/help-command.js';
import VersionCommand from './cli-command/version-command.js';
import CLIApplication from './app/cli-application.js';

const myManager = new CLIApplication();
myManager.registerCommands([
  new GenerateCommand, new ImportCommand, new HelpCommand, new VersionCommand
]);
myManager.processCommand(process.argv);
