module.exports = (ctrl, router) => {
  const postCtrl = ctrl.postCtrl;
  const userCtrl = ctrl.userCtrl;
  const loginCtrl = ctrl.loginCtrl;
  const checkSignIn = loginCtrl.checkSignIn;

  router
    .get('/', checkSignIn, postCtrl.ListPosts)
    .get('/post/new', checkSignIn, postCtrl.ShowAddPost)
    .get('/post/:id', checkSignIn, postCtrl.ShowPost)
    .post('/post', checkSignIn, postCtrl.CreatePost);

  router
    .get('/user/:login', checkSignIn, userCtrl.ShowUser);

  router
    .get('/signup', loginCtrl.ShowSignUp)
    .post('/signup', loginCtrl.CreateUser)
    .get('/login', loginCtrl.ShowLogIn)
    .post('/login', loginCtrl.LogIn)/*
    .get('/protected', 
        checkSignIn, 
        async ctx => {
      await ctx.render('protected', {
        title: 'Protected Page',
        login: ctx.session.user.login
      });
    })*/
    .get('/logout', checkSignIn, loginCtrl.LogOut);
  return router;
}

