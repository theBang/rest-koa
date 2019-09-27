module.exports = mongoose => {
  const User = require('./user.js')(mongoose);
  const Post = require('./post.js')(mongoose, User);
  
  return {
    User: User,
    Post: Post
  };
}
  