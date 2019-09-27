module.exports = (ctrl, Router) => {
  const mainRouter = new Router();
  const adminRouter = new Router();
  const postRouter = new Router();

  const postCtrl = ctrl.postCtrl;
  const userCtrl = ctrl.userCtrl;
  const loginCtrl = ctrl.loginCtrl;
  const adminCtrl = ctrl.adminCtrl;


  mainRouter
    .get('/', ctx => ctx.redirect('/post'));

  postRouter.use('/', loginCtrl.checkSignIn());

  postRouter
    .get('/', postCtrl.listPosts())
    .get('/new', postCtrl.showAddPost())
    .get('/:id', postCtrl.showPost())
    .post('/', postCtrl.createPost());

  mainRouter.use('/post', postRouter.routes(), postRouter.allowedMethods());

  mainRouter
    .get('/user/:login', loginCtrl.checkSignIn(), userCtrl.showUser());

  mainRouter
    .get('/signup', loginCtrl.showSignUp())
    .post('/signup', loginCtrl.createUser())
    .get('/login', loginCtrl.showLogIn())
    .post('/login', loginCtrl.logIn())/*
    .get('/protected', 
        checkSignIn, 
        async ctx => {
      await ctx.render('protected', {
        title: 'Protected Page',
        login: ctx.session.user.login
      });
    })*/
    .get('/logout', loginCtrl.checkSignIn(), loginCtrl.logOut());

  adminRouter
    .get('/', adminCtrl.showColls());

  for(let coll of adminCtrl.colls) 
    adminRouter
      .get(coll.url, adminCtrl.showColl(coll.name))
      .delete(`${coll.url}/:id`, adminCtrl.deleteDoc(coll.name)); 

  mainRouter
    .use(
      '/admin', 
      loginCtrl.checkSignIn(), 
      adminCtrl.checkIsAdmin(), 
      adminRouter.routes(), 
      adminRouter.allowedMethods()
    );

  return mainRouter;
}

