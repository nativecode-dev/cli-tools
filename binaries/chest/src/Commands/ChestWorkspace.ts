import { CommandModule, Argv } from 'yargs'

import { ChestWorkspaceOptions } from './ChestWorkspaceOptions'

export class ChestWorkspace implements CommandModule<{}, ChestWorkspaceOptions> {
  aliases = ['workspace', 'ws']
  command = 'workspace'

  builder = {}

  handler = async (args: ChestWorkspaceOptions) => {
    return
  }
}

export const WorkspaceCommand = new ChestWorkspace()
