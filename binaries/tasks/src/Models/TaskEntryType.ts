export enum TaskEntryType {
  detached = '&',
  env = '$',
  exec = ':',
  nobail = '!',
  parallel = '|',
  shell = '@',
  skip = '#',
  spawn = '>',
}
