module.exports = User => {
  const ShowUser = async ctx => {
    if(ctx.params.login) {
      const login = ctx.params.login;
      const user = await User.findOne({ login: login }).populate({ path: 'posts', options: { sort: { lastChangeAt: -1 } } });
      await ctx.render('show_user', { user: user })
    } else {
      ctx.status(400);
    }
  };

  return {
    ShowUser: ShowUser
  };

};