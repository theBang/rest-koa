module.exports = (models) => {
  const User = models.User;
  const Post = models.Post;

  const listPosts = () => {
    return async ctx => {
      const posts = await Post.find({}).sort({ lastChangeAt: -1 }).populate('author').exec();
      await ctx.render('list', { 
        posts: posts,
        user_ref: '/user/' + ctx.session.user.login 
      })
    };
  }

  const showAddPost = () => {
    return async ctx => {
      await ctx.render('add', {
        user_ref: '/user/' + ctx.session.user.login 
      });
    };
  }

  const showPost = () => {
    return async ctx => {
      if(ctx.params.id) {
        const id = ctx.params.id;
        const post = await Post.findById(id).populate('author').exec();
        await ctx.render('show', { 
          post: post,
          user_ref: '/user/' + ctx.session.user.login  
        })
      } else {
        ctx.status(400);
      }
    };
  }
  const createPost = () => {
    return async ctx => {
      const title = ctx.request.body.title;
      const content = ctx.request.body.content;
      let author = await User.findOne({login: ctx.session.user.login}).exec();
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
  }

  return {
    listPosts: listPosts,
    showAddPost: showAddPost,
    showPost: showPost,
    createPost: createPost
  };

};