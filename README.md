MKMap
======

Multi-key map

Based on ImmutableJS Map

# Usage

```js
import MKMap from 'mkmap'

// MKMap is immutable, so each set() return new MKMap
const map = MKMap(['key1', 'key2', 'key3'])
  .set({key1: 'foo', key2: 'bar', key3: 'baz'    }, 42)
  .set({key1: 'foo', key2: 'bar', key3: 'not baz'}, 999)
  .set({key1: 'foo', key2: 'rab', key3: 'baz'    }, 1024)
  .set({key1: 'this', key2: 'is', key3: 'really' }, 'nice')

// Pass JS object to get value
map.get({key1: 'this', key2: 'is', key3: 'really'}) // 'nice'

// If not all keys are provided, it will return filtered sub-map
const map2 = map.get({key1: 'foo'})

map2.get({key2: 'bar', key3: 'baz'    }) // 42
map2.get({key2: 'bar', key3: 'not baz'}) // 999
map2.get({key2: 'rab', key3: 'baz'    }) // 1024

// If only single type of keys left, it will return just simple map
const map3 = map2.get({key2: 'bar'})

map3.get('baz')     // 42
map3.get('not baz') // 999

// Extra methods
const map4 = map.delete({key1: 'this', key2: 'is', key3: 'really'})
map4.has({key1: 'this', key2: 'is', key3: 'really'}) // false
```
