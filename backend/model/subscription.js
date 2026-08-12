const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  plan: {
    type: String,
    enum: ["Free", "Bronze", "Silver", "Gold"],
    default: "Free",
  },
  maxApplications: {
    type: Number,
    default: 1, // 1 for Free, 3 for Bronze, 5 for Silver, -1 for Gold (unlimited)
  },
  usedApplications: {
    type: Number,
    default: 0,
  },
  lastPaymentDate: {
    type: Date,
  },
  paymentHistory: [
    {
      orderId: String,
      paymentId: String,
      plan: String,
      amount: Number,
      timestamp: { type: Date, default: Date.now },
      invoiceSent: { type: Boolean, default: true },
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
