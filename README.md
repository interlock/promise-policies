[![Build Status](https://travis-ci.org/interlock/promise-policies.svg?branch=master)](https://travis-ci.org/interlock/promise-policies)
[![Dependency Status](https://david-dm.org/interlock/promise-policies.svg)](https://david-dm.org/interlock/promise-policies)
[![Dev Dependency Status](https://david-dm.org/interlock/promise-policies/dev-status.svg)](https://david-dm.org/interlock/promise-policies/dev-status)
[![Package Quality](http://npm.packagequality.com/shield/promise-policies.svg)](http://packagequality.com/#?package=promise-policies)

### Policy

[![Greenkeeper badge](https://badges.greenkeeper.io/interlock/promise-policies.svg)](https://greenkeeper.io/)

A promise based ACL framework.

### Basics, sync policies

```js
const DefaultPolicy = policy.createDefaultPolicy(['create','read']);

class UserPolicy extends DefaultPolicy {
  
  static read(subject, context) {
    if (subject.id === context.user.id) {
      return policy.CODES.ALLOW;
    }
    return policy.CODES.DENY;
  }
  
  static create(subject, context) {
    if (context.user.is_admin) {
      return policy.CODES.ALLOW;
    }
    
    return policy.CODES.DENY;
  }
}

const policies = {
  'User': UserPolicy
};

const resolver = policy.createResolver(function(subject) {
  const name = subject.name || subject.constructor.name;
  return policies[name];
});

resolver.resolve(new User({id: 1}), 'read', { user: { id: 1} }).then((code) => {
  console.log(code); // should be ALLOW
});

resolver.resolve(new User({id: 1}), 'read', { user: { id: 2} }).then((code) => {
  console.log(code); // should be DENY
});

resolver.resolve(User, 'create', { user: { id: 1, is_admin: true} }).then((code) => {
  console.log(code); // should be ALLOW
});

resolver.resolve(User, 'create', { user: { id: 1, is_admin: false} }).then((code) => {
  console.log(code); // should be DENY
});
```

### Async via promises are supported as well

```js

class UserPolicy extends DefaultPolicy {
  
  static read(subject, context) {
    if (subject.id === context.user.id) {
      return Promise.resolve(policy.CODES.ALLOW);
    }
    return Promise.resolve(policy.CODES.DENY);
  }
}
```

### Default Actions
 - create
 - read
 - update
 - delete

 
