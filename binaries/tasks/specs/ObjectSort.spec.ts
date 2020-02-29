import 'mocha'

import expect from './expect'

import { objectSort } from '../src/Sort/ObjectSort'

describe('when using ObjectSort', () => {
  const unsorted = {
    b: {
      child: {
        b: {},
        a: {},
        c: {},
      },
    },
    c: {
      child: {
        b: {},
        a: {},
        c: {},
      },
    },
    a: {
      child: {
        b: ['b', 'c', 'a'],
        a: ['b', 'c', 'a'],
        c: ['b', 'c', 'a'],
      },
    },
  }

  it('should sort object', () => {
    expect(Object.keys(objectSort(unsorted))).to.deep.equal(['a', 'b', 'c'])
  })

  it('should deep sort object', () => {
    expect(Object.keys(objectSort(unsorted).a.child)).to.deep.equal(['a', 'b', 'c'])
  })

  it('should deep sort array', () => {
    expect(objectSort(unsorted).a.child.a).to.deep.equal(['a', 'b', 'c'])
  })
})
