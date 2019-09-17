module.exports = models => {
  const User = models.User;

  const showColls = () => {
    return async ctx => {
      await ctx.render('adminColls', { 
        // Write code here
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
    checkIsAdmin: checkIsAdmin
  };

};