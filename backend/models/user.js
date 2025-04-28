const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'provider', 'customer'],
    required: true
  },
  phone: String,
  address: String,
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  ratings: [{
    rating: Number,
    review: String,
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);