module.exports = mongoose => {
  const User = require('./user.js')(mongoose);
  const Post = require('./post.js')(mongoose);
  
  return {
    User: User,
    Post: Post
  };
}
  