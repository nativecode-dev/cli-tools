import { ProjectLoader } from './ProjectLoader'
import { DefaultNpmLoader } from './Loaders/NpmLoader'
import { DefaultTypeScriptLoader } from './Loaders/TypeScriptLoader'

export const ProjectLoaders: ProjectLoader[] = [DefaultNpmLoader, DefaultTypeScriptLoader]
