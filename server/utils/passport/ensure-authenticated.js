import basePathConfig from '../../configs/basePathConfig';

const basePath = basePathConfig || '';

export default function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect(`${basePath}/logout`);
  }
  const appDb = req.app.locals.appDb
  appDb.collection('users').findOne(
    { uid: req.user },
    { _id: 0, access: 1, blocked: 1, role: 1 },
    function (err, data) {
      if (err) {
        console.log(err);
        return res.redirect(`${basePath}/logout?e=forbidden`);
      } else if (!data || Object.keys(data).length === 0) {
        return res.redirect(`${basePath}/logout?e=forbidden`);
      } else if (('role' in data) && data['role'] === 'admin') {
        return next();
      } else if (('blocked' in data) && data['blocked'] == true) {
        return res.redirect(`${basePath}/logout?e=forbidden`);
      } else if (!('access' in data) || data.access.length == 0) {
        return res.redirect(`${basePath}/logout?e=unauthorized`);
      } else {
        return next();
      }
    });
}
