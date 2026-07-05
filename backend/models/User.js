const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

let MongoUser;
try {
  MongoUser = mongoose.model('User', UserSchema);
} catch (e) {
  MongoUser = mongoose.model('User');
}

const UserModel = {
  findOne: async (query) => MongoUser.findOne(query),
  findById: async (id) => MongoUser.findById(id),
  create: async (userData) => MongoUser.create(userData)
};

module.exports = UserModel;
