### Policy

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
 
### TODO
 - support scope resolving
    - Query -> Query builder pre-loaded with filters on user
    - filterCreate -> list of fields that can be submitted
    - filterUpdate -> list of fields that can be updated
 