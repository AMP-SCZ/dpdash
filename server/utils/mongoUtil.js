const getMongoURI = ({ settings }) => {
  let mongoURI = 'mongodb://' + settings.username + ':';
  mongoURI = mongoURI + settings.password + '@' + settings.host;
  mongoURI = mongoURI + ':' + settings.port + '/' + settings.appDB;
  mongoURI = mongoURI + '?authSource=' + settings.authSource;
  mongoURI = mongoURI + '&tls=' + settings.server.ssl;

  return mongoURI;
}

export { getMongoURI };
