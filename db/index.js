module.exports = mongoose => {
  const { dbURL: connString } = require('../config');
  mongoose.connect(connString, {useNewUrlParser: true});
  mongoose.connection.on('connected', () => {
    console.log('Mongoose opened to ' + connString);
  });
  mongoose.connection.on('error', err => {
    console.log('Mongoose error: ' + err);
  });
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose closed (app termination)');
      process.exit(0);
    });
  });
}