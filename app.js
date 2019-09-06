const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const views = require('koa-views');
const session = require('koa-session');
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');

const PORT = 3000;
const { log } = console;

const app = new Koa();
const router = new Router();

const userSchema = new mongoose.Schema(
  {
    login: String,
    email: String,
    password: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
  }, { versionKey: false }
);

const User = mongoose.model('User', userSchema);

const postSchema = new mongoose.Schema(
  {
    title: String,
    username: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    lastChangeAt: Date
  }, { versionKey: false }
);

const Post = mongoose.model('Post', postSchema);

app.keys = ['some secret'];
app
  .use(logger())
  .use(static(path.join(__dirname, '/public')))
  .use(bodyParser())
  .use(session(app))
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  })
  .use(views(path.join(__dirname, '/views'), { extension: 'pug' }));
  

const checkSignIn = async (ctx, next) => {
   if(ctx.session.user){
      await next();     
   } else {
      ctx.redirect('/login');	
   }
};

// List all Posts

const ListPosts = async ctx => {
  const posts = await Post.find({}).sort({ lastChangeAt: -1 }).populate('author');
  await ctx.render('list', { posts: posts })
};

const ShowAddPost = async ctx => {
  await ctx.render('add');
};

const ShowPost = async ctx => {
  if(ctx.params.id) {
    const id = ctx.params.id;
    const post = await Post.findById(id).populate('author');
    await ctx.render('show', { post: post })
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

const ShowUser = async ctx => {
  if(ctx.params.id) {
    const id = ctx.params.id;
    const user = await User.findById(id).populate({ path: 'posts', options: { sort: { lastChangeAt: -1 } } });
    console.log(user.posts[0])
    await ctx.render('show_user', { user: user })
  } else {
    ctx.status(400);
  }
};

router
  .get('/', checkSignIn, ListPosts)
  .get('/post/new', checkSignIn, ShowAddPost)
  .get('/post/:id', checkSignIn, ShowPost)
  .post('/post', checkSignIn, CreatePost);

router
  .get('/user/:id', checkSignIn, ShowUser);

router
  .get('/signup', async ctx => {
    await ctx.render('signup', { 
      title: 'Sign up',
      registered: ctx.session.user ? true : false,
      login: ctx.session.user ? ctx.session.user.login : undefined
    });
  })
  .post('/signup', async ctx =>  {
    let login = ctx.request.body.login;
    let pass = ctx.request.body.password;
    let req_user = {login: login};
    let user = await User.findOne(req_user);
    if (user && user.login == login) {    
      res.render('signup', {
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
  })
  .get('/login', async ctx => {
    await ctx.render('login', { 
      title: 'Log in',
      login: ctx.session.user ? ctx.session.user.login : undefined 
    });
  })
  .post('/login', async ctx => {
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
  })/*
  .get('/protected', 
      checkSignIn, 
      async ctx => {
    await ctx.render('protected', {
      title: 'Protected Page',
      login: ctx.session.user.login
    });
  })*/
  .get('/logout', async ctx => {
    ctx.session = null;
    ctx.redirect('/login');
  });

app.use(router.routes());

app.on('error', function(err) {
  if (process.env.NODE_ENV != 'test') {
    console.log('sent error %s to the cloud', err.message);
    console.log(err);
  }
});

app.use(async function pageNotFound(ctx) {
  // we need to explicitly set 404 here
  // so that koa doesn't assign 200 on body=
  ctx.status = 404;

  switch (ctx.accepts('html', 'json')) {
    case 'html':
      ctx.type = 'html';
      ctx.body = '<h1>404</h1>';
      break;
    case 'json':
      ctx.body = {
        message: 'Page Not Found'
      };
      break;
    default:
      ctx.type = 'text';
      ctx.body = 'Page Not Found';
  }
});

if (!module.parent) 
  app.listen(process.env.PORT || PORT, () => 
    log(`pid: ${process.pid}; port: ${process.env.PORT || PORT}`));

const connString = 'mongodb://localhost:27017/restdb';
mongoose.connect(connString, {useNewUrlParser: true});
mongoose.connection.on('connected', () => {
  log('Mongoose opened to ' + connString);
});
mongoose.connection.on('error', err => {
  log('Mongoose error: ' + err);
});
mongoose.connection.on('disconnected', () => {
  log('Mongoose disconnected');
});
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    log('Mongoose closed (app termination)');
    process.exit(0);
  });
});
