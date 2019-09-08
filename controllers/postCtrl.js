module.exports = (models) => {
  const User = models.User;
  const Post = models.Post;

  const ListPosts = async ctx => {
    const posts = await Post.find({}).sort({ lastChangeAt: -1 }).populate('author');
    await ctx.render('list', { 
      posts: posts,
      user_ref: '/user/' + ctx.session.user.login 
    })
  };

  const ShowAddPost = async ctx => {
    await ctx.render('add', {
      user_ref: '/user/' + ctx.session.user.login 
    });
  };

  const ShowPost = async ctx => {
    if(ctx.params.id) {
      const id = ctx.params.id;
      const post = await Post.findById(id).populate('author');
      await ctx.render('show', { 
        post: post,
        user_ref: '/user/' + ctx.session.user.login  
      })
    } else {
      ctx.status(400);
    }
  };

  const CreatePost = async ctx => {
      const title = ctx.request.body.title;
      const content = ctx.request.body.content;
      console.log(ctx.session);
      let author = await User.findOne({login: ctx.session.user.login});
      const post = new Post({
        title: title, 
        content: content,
        author: author._id,
        lastChangeAt: Date.now()
      });
      author.posts.push(post._id);
      await author.save();
      await post.save();
      await ctx.redirect('/');
  };

  return {
    ListPosts: ListPosts,
    ShowAddPost: ShowAddPost,
    ShowPost: ShowPost,
    CreatePost: CreatePost
  };

};