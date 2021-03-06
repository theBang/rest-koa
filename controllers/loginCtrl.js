module.exports = (User) => {
  const showSignUp = () => {
    return async ctx => {
      await ctx.render('signup', { 
        title: 'Sign up',
        registered: ctx.session.user ? true : false,
        login: ctx.session.user ? ctx.session.user.login : undefined
      });
    };
  }
  
  const createUser = () => {
    return async ctx =>  {
      let login = ctx.request.body.login;
      let pass = ctx.request.body.password;
      let req_user = {login: login};
      let user = await User.findOne(req_user).exec();
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
      let user = await User.findOne(req_user).exec();
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

  const checkSignIn = () => {
    return async (ctx, next) => {
      if(ctx.session.user){
        await next();     
      } else {
        ctx.redirect('/login'); 
      }
    };
  }
  
  return {
    showSignUp: showSignUp,
    createUser: createUser,
    showLogIn: showLogIn,
    logIn: logIn,
    logOut: logOut,
    checkSignIn: checkSignIn
  };

};