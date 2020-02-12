import expect from './expect'

import { DockerHubTags, DockerHubTagType } from '../src/DockerHubTags'

describe('when using tags', () => {
  const sut = new DockerHubTags('linuxserver/radarr', DockerHubTagType.semver)

  it('should get latest', async () => {
    const tags = await sut.tags()
    expect(tags.latest('v2.13.5-ls57')).is.not.empty
  })
})
