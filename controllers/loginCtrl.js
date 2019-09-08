module.exports = (User) => {
  const ShowSignUp = async ctx => {
    await ctx.render('signup', { 
      title: 'Sign up',
      registered: ctx.session.user ? true : false,
      login: ctx.session.user ? ctx.session.user.login : undefined
    });
  };

  const CreateUser = async ctx =>  {
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
        password: pass
      }).save();
      ctx.session.user = req_user;
      ctx.redirect('/');
    }
  };

  const ShowLogIn = async ctx => {
    await ctx.render('login', { 
      title: 'Log in',
      login: ctx.session.user ? ctx.session.user.login : undefined 
    });
  };

  const LogIn = async ctx => {
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

  const LogOut = async ctx => {
    ctx.session = null;
    ctx.redirect('/login');
  };

  const checkSignIn = async (ctx, next) => {
     if(ctx.session.user){
        await next();     
     } else {
        ctx.redirect('/login'); 
     }
  };
  
  return {
    ShowSignUp: ShowSignUp,
    CreateUser: CreateUser,
    ShowLogIn: ShowLogIn,
    LogIn: LogIn,
    LogOut: LogOut,
    checkSignIn: checkSignIn
  };

};