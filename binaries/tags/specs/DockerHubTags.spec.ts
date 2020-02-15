import expect from './expect'

import { DockerHubTags } from '../src/v1/DockerHubTags'
import { DockerHubTagType } from '../src/v1/DockerHubTagType'

describe('when using tags', () => {
  const hydra = new DockerHubTags({ repository: 'linuxserver/hydra2' })
  const ombi = new DockerHubTags({ repository: 'linuxserver/ombi', tagStartsWith: ['v'] })

  it('should get latest within range', async () => {
    const tags = await hydra.tags()
    expect(tags.latest('v2', 'v2.13')).is.equal('v2.13.0-ls9')
  })

  it('should get exact version', async () => {
    const tags = await ombi.tags()
    expect(tags.latest('3.0', 'v3.0.4892-ls45')).to.equal('v3.0.4892-ls45')
  })
})
