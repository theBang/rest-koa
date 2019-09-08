module.exports = mongoose => 
  mongoose.model('Post', new mongoose.Schema(
    {
      title: String,
      username: String,
      content: String,
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      lastChangeAt: Date
    }, { versionKey: false }
  ));
