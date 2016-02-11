import {Map as IMap, Set as ISet, is} from 'immutable'

module.exports = function MultiKeyMap (keyNames, map = IMap()) {
  return {
    keyNames: ISet(keyNames),
    map,
    get (keys) {
      keys = IMap(keys)
      const keyNames = this.keyNames
      const validKeys = keys
        .toKeyedSeq()
        .filter((v, k) => keyNames.has(k))
        .toMap()
      const validKeyNames = ISet(validKeys.keys())

      if (this.keyNames.isSubset(validKeyNames)) {
        // Every keys are provided
        return map.get(validKeys)
      } else {
        const submap = map
          .toKeyedSeq()
          .filter((v, kmap) => validKeys.every((v, k) => is(v, kmap.get(k))))
          .mapKeys(k => k.filterNot((v, k2) => validKeyNames.has(k2)))
          .toMap()
        const subKeyNames = keyNames.subtract(validKeyNames)

        if (subKeyNames.size === 1) {
          // Only single kind of keys are left
          const lastKeyName = subKeyNames.first()
          return submap.mapKeys(k => k.get(lastKeyName))
        }
        return MultiKeyMap(subKeyNames, submap)
      }
    },
    has (keys) {
      if (!ISet(Object.keys(keys)).isSuperset(this.keyNames)) {
        // All needed keys must be provided to set value
        // Otherwise, it throws error
        throw new Error(`MKMap - Not enough keys. required: [${this.keyNames.join(', ')}] but provided: [${Object.keys(keys).join(', ')}]`)
      }

      return map.has(IMap(keys))
    },
    set (keys, value) {
      if (!ISet(Object.keys(keys)).isSuperset(this.keyNames)) {
        // All needed keys must be provided to set value
        // Otherwise, it throws error
        throw new Error(`MKMap - Not enough keys. required: [${this.keyNames.join(', ')}] but provided: [${Object.keys(keys).join(', ')}]`)
      }

      const newMap = map.set(IMap(keys), value)
      if (newMap === map) {
        // Map not modified
        return this
      }

      return MultiKeyMap(keyNames, newMap)
    },
    delete (keys) {
      if (!ISet(Object.keys(keys)).isSuperset(this.keyNames)) {
        // All needed keys must be provided to delete value
        // Otherwise, it throws error
        throw new Error(`MKMap - Not enough keys. required: [${this.keyNames.join(', ')}] but provided: [${Object.keys(keys).join(', ')}]`)
      }

      const newMap = map.delete(IMap(keys))
      if (newMap === map) {
        // Map not modified
        return this
      }

      return MultiKeyMap(keyNames, newMap)
    }
  }
}
