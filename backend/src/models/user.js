// User model with hashed passwords and profile stats
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true, default: null },
  lastName: { type: String, required: true, default: null },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
  token: { type: String, required: false, default: null },
}, { timestamps: true });

// const userSchema = new mongoose.Schema({
//     firstName: { type: String, required: true, default: null },
//     lastName: { type: String, required: true, default: null },
//     email: { type: String, required: true, default: null, unique: true },
//     username: { type: String, required: true, default: null, unique: true },
//     password: { type: String, required: true, default: null },
//     token: { type: String, required: false, default: null },
// }, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);