const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  totalPrice: Number,
  notes: String,
  rating: {
    score: Number,
    review: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);