const CODES = {
  DENY: Symbol.for('DENY'),
  ALLOW: Symbol.for('ALLOW'),
};

const defaultActions = ['create', 'read', 'update', 'delete'];


const createDefaultPolicy = function(actions) {
  actions = actions || defaultActions;
  class DefaultPolicy {

  }

  actions.forEach((action) => {
    Object.defineProperty(DefaultPolicy, action, {
      enumerable: false,
      value() {
        return CODES.DENY;
      },
    });
  });

  return DefaultPolicy;
};


module.exports = {
  createDefaultPolicy,
  CODES
};
