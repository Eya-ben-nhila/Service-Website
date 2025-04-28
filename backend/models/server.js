const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Plumbing', 'AC Repair', 'Electrical', 'Carpentry', 'Cleaning', 'Other']
  },
  description: {
    type: String,
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  priceUnit: {
    type: String,
    enum: ['per hour', 'per day', 'fixed'],
    default: 'per hour'
  },
  availability: {
    type: Boolean,
    default: true
  },
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

module.exports = mongoose.model('Service', serviceSchema);