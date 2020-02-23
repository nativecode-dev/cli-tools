export enum TaskEntryType {
  bail = '!',
  detached = '&',
  env = '$',
  exec = ':',
  parallel = '|',
  shell = '@',
  skip = '#',
  spawn = '>',
}
