const CODES = {
  DENY: Symbol('Deny'),
  ALLOW: Symbol('Allow'),
};

const defaultActions = ['create', 'read', 'update', 'delete'];

class Policy {
  static createDefaultPolicy(actions) {
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
  }
}

module.exports = {
  Policy,
  CODES
};