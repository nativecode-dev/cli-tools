import { RepositoryImage } from './RepositoryImage'

export interface RepositoryTag {
  name: string
  full_size: number
  images: RepositoryImage[]
  id: number
  repository: number
  creator: number
  last_updater: number
  last_updater_username: string
  image_id: string | null
  v2: boolean
  last_updated: string
}
