const Acl = require('acl');

const acl = new Acl(new Acl.memoryBackend());

exports.invokeRolesPolicies = function () {
  acl.allow([
    {
      roles: ['Admin'],
      allows: [
        {
          resources: '/api/pdfs',
          permissions: ['get']
        },
        {
          resources: '/api/pdf',
          permissions: ['post']
        },
        {
          resources: '/api/pdf/:pdfId',
          permissions: ['get', 'delete', 'patch']
        },
        {
          resources: '/api/pdf-count',
          permissions: ['get']
        }
      ]
    },
    {
      roles: ['Author', 'Publication House', 'Parttime Blogger'],
      allows: [
        {
          resources: '/api/pdfs',
          permissions: ['get']
        },
        {
          resources: '/api/pdf',
          permissions: ['post']
        },
        {
          resources: '/api/pdf/:pdfId',
          permissions: ['get', 'delete', 'patch']
        },
        {
          resources: '/api/pdf-count',
          permissions: ['get']
        }
      ]
    },
    {
      roles: ['Reader'],
      allows: [
        {
          resources: '/api/pdfs',
          permissions: ['get']
        },
        {
          resource: '/api/pdf/:pdfId',
          premissions: ['get']
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
