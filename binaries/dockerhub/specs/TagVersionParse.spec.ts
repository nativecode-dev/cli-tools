import 'mocha'

import expect from './expect'

import { tagVersionParse } from '../src/TagVersionParse'

const VALID_VERSIONS = [
  '2.0.13',
  'v2.0.13',
  'v2.0.13-ls82',
  '3.0.0.38',
  'v3.0.0.38',
  'v3.0.0.38-ls38',
  'amd64-v3.0.8',
  'amd64-v3.0.8-ls03',
  '4.1.5.9342',
  'v4.1.5.9342',
  'v4.1.5.9342-ls3',
  'armv7-v4.1.5.9342',
  'armv7-v4.1.5.9342-ls3',
]

const INVALID_VERSIONS = ['latest', 'amd64-latest']

describe('when using tagVersionParse', () => {
  it('should test valid versions', () =>
    VALID_VERSIONS.forEach((version) => expect(tagVersionParse(version)).to.not.be.empty))

  it('should test invalid versions', () =>
    INVALID_VERSIONS.forEach((version) => expect(tagVersionParse(version)).to.be.null))
})
