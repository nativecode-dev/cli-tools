import { TagVersion } from './TagVersion'

/*
------------------------------------
VALID
------------------------------------
2.0.13
v2.0.13
v2.0.13-ls82
3.0.0.38
v3.0.0.38
v3.0.0.38-ls38
amd64-v3.0.8
amd64-v3.0.8-ls03
4.1.5.9342
v4.1.5.9342
v4.1.5.9342-ls3
armv7-v4.1.5.9342
armv7-v4.1.5.9342-ls3
------------------------------------
INVALID
------------------------------------
latest
amd64-latest
20190228
*/
const GlobalPattern = '^(?:([a-zA-Z0-9]+)-)?v?((?:[0-9]{0,3}\\.){2,3}[0-9]+)(?:-([\\w\\d]+))?$'
const GlobalRegex = new RegExp(GlobalPattern, 'm')

export const SemVerRegex = (cached: boolean = true) => (cached ? GlobalRegex : new RegExp(GlobalPattern, 'gm'))

export function TagVersionParse(version: string): TagVersion | null {
  const pattern = SemVerRegex(false)
  const matches = pattern.exec(version)
  return matches ? { arch: matches[1], original: matches[0], prerelease: matches[3], value: matches[2] } : null
}
