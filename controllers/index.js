module.exports = models => {
  const postCtrl = require('./postCtrl.js')(models);
  const loginCtrl = require('./loginCtrl.js')(models.User);
  const userCtrl = require('./userCtrl.js')(models.User);

  return {
    postCtrl: postCtrl,
    loginCtrl: loginCtrl,
    userCtrl: userCtrl
  };
}
  