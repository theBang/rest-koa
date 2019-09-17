module.exports = models => {
  const postCtrl = require('./postCtrl.js')(models);
  const loginCtrl = require('./loginCtrl.js')(models.User);
  const userCtrl = require('./userCtrl.js')(models.User);
  const adminCtrl = require('./adminCtrl.js')(models);

  return {
    postCtrl: postCtrl,
    loginCtrl: loginCtrl,
    userCtrl: userCtrl,
    adminCtrl: adminCtrl
  };
}
  