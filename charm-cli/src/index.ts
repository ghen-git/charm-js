#! /usr/bin/env node
import * as dispatcher from './dispatcher'

import start from './commands/start';

dispatcher.addCommand('start', start);

dispatcher.dispatch();