/**
 * functional mixin for creating class decorators
 * http://raganwald.com/2015/06/26/decorators-in-es7.html
 * http://raganwald.com/2015/06/17/functional-mixins.html
 */

function decorateClass(behaviour, sharedBehaviour = {}) {

  const instanceKeys = Reflect.ownKeys(behaviour);
  const sharedKeys = Reflect.ownKeys(sharedBehaviour);
  const typeTag = Symbol('isInstanceOf');

  function mixin (_class) {
    for (let property of instanceKeys)
      Object.defineProperty(_class.prototype, property, {
        value: behaviour[property],
        writable: true
      });
    Object.defineProperty(_class.prototype, typeTag, { value: true });
    return _class;
  }

  for (let property of sharedKeys) {
    Object.defineProperty(mixin, property, {
      value: sharedBehaviour[property],
      enumerable: sharedBehaviour.propertyIsEnumerable(property)
    });
  }

  Object.defineProperty(mixin, Symbol.hasInstance, {
    value: (i) => !!i[typeTag]
  });

  return mixin;

}

module.exports = decorateClass;
