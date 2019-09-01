import yargs, { Argv } from 'yargs'

export default function ClamShell(): Argv<{}> {
  return yargs
    .env('CLAM_')
    .help()
    .showHelpOnFail(false)
    .strict()
}
