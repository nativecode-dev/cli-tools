import expect from './expect'

import { DockerHubTags } from '../src/DockerHubTags'
import { DockerHubTagType } from '../src/DockerHubTagType'

describe('when using tags', () => {
  it('should get latest radarr', async () => {
    const sut = new DockerHubTags('linuxserver/radarr', DockerHubTagType.semver)
    const tags = await sut.tags()
    expect(tags.latest('v2.13.5-ls57')).is.not.empty
  })

  it('should get latest jackett', async () => {
    const sut = new DockerHubTags('linuxserver/jackett', DockerHubTagType.semver)
    const tags = await sut.tags()
    expect(tags.latest('v0.12.1804-ls53')).is.not.empty
  })

  it('should get latest nzbhydra', async () => {
    const sut = new DockerHubTags('linuxserver/hydra2', DockerHubTagType.semver)
    const tags = await sut.tags()
    expect(tags.latest('v2.13.7-ls58')).is.not.empty
  })

  it('should get latest ombi', async () => {
    const sut = new DockerHubTags('linuxserver/ombi', DockerHubTagType.semver)
    const tags = await sut.tags()
    expect(tags.latest('3.0.5020-ls3', 'v4.0')).is.not.empty
  })
})
