module.exports = (mongoose, User) => {
  const postSchema = new mongoose.Schema({
      title: String,
      username: String,
      content: String,
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      lastChangeAt: Date
    }, { versionKey: false });
  
  postSchema.pre('deleteOne', async function (next) {
    console.log('--------------------------------------------------------------------');
    let author = await User.findById(this.getQuery().author).exec();
    console.log(author);
    const index = author.posts.indexOf(this.getQuery()._id);
    if (index > -1) {
      author.posts.splice(index, 1);
    }
    await author.save();
    next();
  });

  return mongoose.model('Post', postSchema);
}

