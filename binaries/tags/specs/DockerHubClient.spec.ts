import expect from './expect'

import { DockerHubClient } from '../src/DockerHubClient'
import { RepositoryInfo } from '../src/Models/RepositoryInfo'

const DOCKERHUB_USERNAME = process.env.DOCKERHUB_USERNAME || 'username'
const DOCKERHUB_PASSWORD = process.env.DOCKERHUB_PASSWORD || 'password'

function repository(repositories: RepositoryInfo[]): RepositoryInfo {
  return repositories.reduce<RepositoryInfo>(
    (results, current) => (current.name === 'mntnfs' ? current : results),
    repositories[0],
  )
}

function username(namespaces: string[]): string {
  return namespaces.reduce<string>((results, current) => (current === 'nativecode' ? current : results), 'nativecode')
}

describe('when using DockerHubClient', () => {
  it('should create valid instance', () => {
    const sut = new DockerHubClient()
    expect(sut).to.not.be.undefined
  })

  describe('with a valid instance', () => {
    const client = new DockerHubClient()

    it('should authenticate login', async () => {
      const token = await client.auth.login(DOCKERHUB_USERNAME, DOCKERHUB_PASSWORD)
      expect(token).to.not.be.empty
    })

    it('should list namespaces', async () => {
      const namespaces = await client.namespace.list()
      expect(namespaces).to.include('nativecode')
    })

    it('should list repositories', async () => {
      const namespaces = await client.namespace.list()
      const user = username(namespaces)
      const repositories = await client.repository.list(user)
      expect(repositories.results.map(repo => repo.name)).to.include('mntnfs')
    })

    it('should list tags', async () => {
      const namespaces = await client.namespace.list()
      const user = username(namespaces)
      const repositories = await client.repository.list(user)
      const tags = await client.tag.list(user, repository(repositories.results).name)
      expect(tags.results.map(tag => tag.name)).to.include('1.105')
    })

    it('should filter tags that start with "v"', async () => {
      const results = await client.filter(tag => tag.name.startsWith('v')).find('linuxserver', 'radarr')
      expect(results.every(result => result.name.startsWith('v'))).to.be.true
    })

    it('should filter tags that do not start with "v"', async () => {
      const results = await client.filter(tag => tag.name.startsWith('v') === false).find('linuxserver', 'radarr')
      expect(results.every(result => result.name.startsWith('v'))).to.be.false
    })

    it('should find only semver tags', async () => {
      const results = await client.filter(tag => client.semver(tag.name)).find('linuxserver', 'radarr')
      expect(results.every(result => client.semver(result.name))).to.be.true
    })

    it('should find only text tags', async () => {
      const results = await client.filter(tag => client.text(tag.name)).find('linuxserver', 'radarr')
      expect(results.every(result => client.text(result.name))).to.be.true
    })
  })
})
