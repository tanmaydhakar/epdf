const Acl = require('acl');

const acl = new Acl(new Acl.memoryBackend());

exports.invokeRolesPolicies = function () {
  acl.allow([
    {
      roles: ['Admin'],
      allows: [
        {
          resources: '/api/roles',
          permissions: ['get']
        }
      ]
    },
    {
      roles: ['Author', 'Publication House', 'Parttime Blogger'],
      allows: [
        {
          resources: '/api/roles',
          permissions: ['get']
        }
      ]
    },
    {
      roles: ['Reader'],
      allows: [
        {
          resources: '/api/user/:userId/userRole/:roleId',
          permissions: ['post', 'delete']
        }
      ]
    },
    {
      roles: ['Guest'],
      allows: []
    }
  ]);
};

exports.isAllowed = function (req, res, next) {
  const roles = req.user ? req.user.roles : ['Guest'];

  acl.areAnyRolesAllowed(
    roles,
    req.route.path,
    req.method.toLowerCase(),
    function (err, isAllowed) {
      if (err) {
        return res.status(500).json({ message: 'some unexpected error occured' });
      }
      if (!isAllowed) {
        return res.status(403).json({ message: 'user is unauthorized to access this resource' });
      }
      return next();
    }
  );
};
