import expect from './expect'

import { DockerTags } from '../src/DockerHubTags'

describe('when using tags', () => {
  const sut = new DockerTags('linuxserver/hydra2')

  it('should get tags', async () => {
    const tags = await sut.tags()
    expect(tags.latestVersions('v2.13.5-ls57')).is.not.empty
  })

  it('should get latest', async () => {
    const tags = await sut.tags()
    expect(tags.latest('v2.13.5-ls57')).is.not.empty
  })
})
