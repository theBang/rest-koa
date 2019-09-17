module.exports = User => {
  const showUser = () => { 
    return async ctx => {
      if(ctx.params.login) {
        const login = ctx.params.login;
        const user = await User.findOne({ login: login }).populate({ path: 'posts', options: { sort: { lastChangeAt: -1 } } });
        await ctx.render('show_user', { 
          user: user,
          logged_user: '/user/' + ctx.session.user.login 
        })
      } else {
        ctx.status(400);
      }
    };
  }

  return {
    showUser: showUser
  };

};