module.exports = models => {
  const User = models.User;
  const colls = new Array;

  for (let key in models) {
    let strKey = String(key);
    colls.push({
      url: '/' + strKey.toLowerCase(),
      name: strKey
    });        
  }

  const showColls = () => {
    return async ctx => {
      await ctx.render('admin_colls', { 
        colls: colls,
        user_ref: '/user/' + ctx.session.user.login 
      });
    };
  }

  const showColl = (collName) => {
    return async ctx => {
      let model;
      for (let key in models) {
        if (collName == String(key))
          model = models[key];
      }

      let objs = await model.find({});
      for (let obj of objs) {
        console.log(obj);
      } 
     
      await ctx.render('admin_one_coll', { 
        name: collName,
        objs: objs,
        user_ref: '/user/' + ctx.session.user.login 
      });
    };
  }
  
  const createUser = () => {
    return async ctx =>  {
      let login = ctx.request.body.login;
      let pass = ctx.request.body.password;
      let req_user = {login: login};
      let user = await User.findOne(req_user);
      if (user && user.login == login) {   
        await ctx.render('signup', {
          title: 'Sign up',
          login: login
        });
      } else {
        await new User({
          login: login, 
          password: pass,
          role: 'user'
        }).save();
        ctx.session.user = req_user;
        ctx.redirect('/');
      }
    };
  }

  const showLogIn = () => {
    return async ctx => {
      await ctx.render('login', { 
        title: 'Log in',
        login: ctx.session.user ? ctx.session.user.login : undefined 
      });
    };
  }

  const logIn = () => {
    return async ctx => {
      let login = ctx.request.body.login;
      let pass = ctx.request.body.password;
      let req_user = {login: login};
      let user = await User.findOne(req_user);
      if (user && user.login == login && 
          user.password == pass) {    
        ctx.session.user = req_user;
        ctx.redirect('/');
      }
      else {
        ctx.redirect('/signup');
      } 
    };
  }

  const logOut = () => {
    return async ctx => {
      ctx.session = null;
      ctx.redirect('/login');
    };
  }

  const checkIsAdmin = () => {
    return async (ctx, next) => {
      const { role } = await User.findOne({ login: ctx.session.user.login }).select('role').exec();
      if(role == 'admin'){
        await next();     
      } else {
        ctx.redirect('/'); 
      }
    };
  }
  
  return {
    checkIsAdmin: checkIsAdmin,
    showColls: showColls,
    showColl: showColl,
    colls: colls
  };

};