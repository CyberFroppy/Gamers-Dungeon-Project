exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/dungeonsdb';
exports.PORT = process.env.PORT || 8080;
exports.API_SECRET = process.env.API_SECRET || 'secret';
exports.HASHING_ROUNDS = process.env.HASHING_ROUNDS || 10;
