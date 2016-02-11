import {describe, it} from 'mocha'
import {expect} from 'chai'
import MKMap from '../src'

describe('MKMap', function () {
  const map = MKMap(['key1', 'key2', 'key3'])
    .set({key1: 'foo', key2: 'bar', key3: 'baz'}, 'foobarbaz')
    .set({key1: 'foo', key2: 'baz', key3: 'bar'}, 'foobazbar')
    .set({key1: 'baz', key2: 'foo', key3: 'bar'}, 'bazfoobar')

  it('should return value when all keys are provided', function () {
    const foobarbaz = map.get({key1: 'foo', key2: 'bar', key3: 'baz'})
    expect(foobarbaz).to.equal('foobarbaz')

    const foobazbar = map.get({key1: 'foo', key2: 'baz', key3: 'bar'})
    expect(foobazbar).to.equal('foobazbar')

    const bazfoobar = map.get({key1: 'baz', key2: 'foo', key3: 'bar'})
    expect(bazfoobar).to.equal('bazfoobar')
  })

  it('should return sub-mkmap when not all keys are provided', function () {
    const submap = map.get({key1: 'foo'})

    const barbaz = submap.get({key2: 'bar', key3: 'baz'})
    expect(barbaz).to.equal('foobarbaz')

    const bazbar = submap.get({key2: 'baz', key3: 'bar'})
    expect(bazbar).to.equal('foobazbar')
  })

  it('should ignore non-valid keys', function () {
    const overflow = map.get({
      notkey: 'no, really',
      key1: 'foo',
      key2: 'bar',
      key3: 'baz',
      key4: 'foofoo',
      key5: 'barbar',
      key6: 'bazbaz'
    })

    expect(overflow).to.equal('foobarbaz')
  })
})
