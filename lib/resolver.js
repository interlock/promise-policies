const Promise = require('bluebird');

class BasePolicyResolver {

  /**
   * Lookup a Policy based on the subject given
   * @param subject
   * @return {Promise} resolving to Policy
   */
  static lookup(subject) {
    return Promise.reject(new Error("lookup must be implemented"));
  }

  /**
   * Resolve a subject with the context
   * @param subject
   * @param action
   * @param context
   */
  static resolve(subject, action, context) {
    return this.lookup(subject).then((policy) => {
      if (policy[action] === undefined) {
        return Promise.reject(new Error("policy does not define action"));
      } else {
        const result = policy[action](subject, context);
        if (result.then !== undefined) return result;
        return Promise.resolve(result);
      }
    });
  }
}

const createResolver = (lookup) => {
  class PolicyResolver extends BasePolicyResolver {
  }

  if (typeof lookup === 'function') {
    Object.defineProperty(PolicyResolver, 'lookup', {
      enumerable: false,
      value: lookup
    });
  }

  return PolicyResolver;
};

module.exports = createResolver;