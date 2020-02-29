import yargs from 'yargs'

yargs
  .scriptName('squish')
  .usage('$0 <command>')
  .showHelp()
  .showHelpOnFail(false)
  .parse()
