module.exports = mongoose => 
  mongoose.model('User', new mongoose.Schema(
    {
      login: String,
      email: String,
      password: String,
      role: String,
      posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
    }, { versionKey: false }
  ));