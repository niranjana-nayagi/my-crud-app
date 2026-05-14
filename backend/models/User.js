const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,              // removes extra spaces
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,            // no two users can have the same email
    lowercase: true,         // always store email in lowercase
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false            // IMPORTANT: never include password in query results by default
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'viewer'],  // only these three values allowed
    default: 'viewer'
  }
}, {
  timestamps: true  // automatically adds createdAt and updatedAt fields
});

// This runs automatically BEFORE saving a user to the database
userSchema.pre('save', async function(next) {
  // Only hash the password if it was changed (not on other updates)
  if (!this.isModified('password')) return next();
  
  // Hash the password with a "salt rounds" of 12 (higher = more secure but slower)
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// A method to compare passwords during login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);