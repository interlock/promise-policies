const Promise = require('bluebird');

class PolicyResolverError extends Error {
  constructor(message, action = null) {
    super(message);
    this.action = action;
  }

  toString() {
    return `${this.constructor.name}: ${this.message} [action=${this.action}]`;
  }
}

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
        return Promise.reject(new PolicyResolverError("policy does not define action", action));
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
