import { IScriptsMap } from './IScriptsMap'
import { IRepository } from './IRepository'
import { IPublishConfig } from './IPublishConfig'
import { IEngines } from './IEngines'
import { IDirectories } from './IDirectories'
import { IDependencyMap } from './IDependencyMap'
import { IConfig } from './IConfig'
import { IBugs } from './IBugs'
import { IBinMap } from './IBinMap'
import { IAuthor } from './IAuthor'

export interface Npm extends Object {
  readonly name: string
  readonly version?: string
  readonly description?: string
  readonly keywords?: string[]
  readonly homepage?: string
  readonly bugs?: string | IBugs
  readonly license?: string
  readonly author?: string | IAuthor
  readonly contributors?: string[] | IAuthor[]
  readonly files?: string[]
  readonly main?: string
  readonly bin?: string | IBinMap
  readonly man?: string | string[]
  readonly directories?: IDirectories
  readonly repository?: string | IRepository
  readonly scripts?: IScriptsMap
  readonly config?: IConfig
  readonly dependencies?: IDependencyMap
  readonly devDependencies?: IDependencyMap
  readonly peerDependencies?: IDependencyMap
  readonly optionalDependencies?: IDependencyMap
  readonly bundledDependencies?: string[]
  readonly engines?: IEngines
  readonly os?: string[]
  readonly cpu?: string[]
  readonly preferGlobal?: boolean
  readonly private?: boolean
  readonly publishConfig?: IPublishConfig
}
