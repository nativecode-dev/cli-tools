import { TagVersion } from './TagVersion'

const GlobalPattern = '^(?:([a-zA-Z0-9]+)-)?v?((?:[0-9]+.){2,3}[0-9]+)(?:-([\\w\\d]+))?$'
const GlobalRegex = new RegExp(GlobalPattern, 'm')

export const SemVerRegex = (cached: boolean = true) => (cached ? GlobalRegex : new RegExp(GlobalPattern, 'gm'))

export function TagVersionParse(version: string): TagVersion | null {
  const pattern = SemVerRegex(false)
  const matches = pattern.exec(version)
  return matches ? { arch: matches[1], original: matches[0], prerelease: matches[3], value: matches[2] } : null
}
