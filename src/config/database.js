const database = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || '27017',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  name: process.env.DB_NAME || 'eton-bikes',
  replica: process.env.DB_REPLICA || false
};

database.uri = `mongodb://${database.host}/${database.name}`;
if(database.user !== '') database.uri = `mongodb://${database.user}:${encodeURIComponent(database.password)}@${database.host}:${database.port}/${database.name}?authSource=admin`;

export default database;
