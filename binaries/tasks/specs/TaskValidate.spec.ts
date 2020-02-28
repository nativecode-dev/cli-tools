import 'mocha'

import expect from './expect'

import { taskValidate } from '../src/Tasks/TaskValidate'

// describe('when using taskValidate', () => {
//   it('should invalidate config', async () => {
//     const valid = await taskValidate('../tasks.v2.json')
//     expect(valid).to.be.false
//   })

//   it('should validate config', async () => {
//     const valid = await taskValidate('../tasks.json')
//     expect(valid).to.be.true
//   })
// })

describe('when using taskValidateConfig', () => {
  it('should invalidate config', () => expect(taskValidate({ tasks: { test: '' } })).to.eventually.be.false)
  it('should validate config', () => expect(taskValidate({ tasks: { test: [] } })).to.eventually.be.true)
})
