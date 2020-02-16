export interface RepositoryInfo {
  user: string
  name: string
  namespace: string
  repository_type: string
  status: number
  description: string
  is_private: boolean
  is_automated: boolean
  can_edit: boolean
  star_count: number
  pull_count: number
  last_updated: string
  is_migrated: boolean
}
