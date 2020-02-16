import 'mocha'

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
      const namespaces = await client.namespaces.list()
      expect(namespaces).to.include('nativecode')
    })

    it('should list repositories', async () => {
      const namespaces = await client.namespaces.list()
      const user = username(namespaces)
      const repositories = await client.repositories.list(user)
      expect(repositories.results.map(repo => repo.name)).to.include('mntnfs')
    })

    it('should list tags', async () => {
      const namespaces = await client.namespaces.list()
      const user = username(namespaces)
      const repositories = await client.repositories.list(user)
      const tags = await client.tags.list(user, repository(repositories.results).name)
      expect(tags.results.map(tag => tag.name)).to.include('1.105')
    })

    it('should filter tags that start with "v"', async () => {
      const results = await client.match(tag => tag.repository.name.startsWith('v')).find('linuxserver', 'radarr')
      expect(results.every(result => result.repository.name.startsWith('v'))).to.be.true
    })

    it('should filter tags that do not start with "v"', async () => {
      const results = await client
        .match(tag => tag.repository.name.startsWith('v') === false)
        .find('linuxserver', 'radarr')
      expect(results.every(result => result.repository.name.startsWith('v'))).to.be.false
    })
  })
})
