const express = require("express");
const router = express.Router();
const Subscription = require("../model/subscription");
const { sendInvoiceEmail } = require("../utils/mailer");

// Helper to check if current time is within 10:00 AM – 11:00 AM IST
const checkIsPaymentWindowOpen = () => {
  const options = { timeZone: "Asia/Kolkata", hour12: false, hour: "2-digit" };
  const istHourStr = new Intl.DateTimeFormat("en-US", options).format(new Date());
  const istHour = parseInt(istHourStr, 10);
  return istHour === 10;
};

const PLAN_DETAILS = {
  Free: { price: 0, maxApplications: 1 },
  Bronze: { price: 100, maxApplications: 3 },
  Silver: { price: 300, maxApplications: 5 },
  Gold: { price: 1000, maxApplications: -1 }, // -1 means unlimited
};

// GET candidate subscription state & window status
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    let sub = await Subscription.findOne({ email });
    if (!sub) {
      sub = await Subscription.create({
        email,
        plan: "Free",
        maxApplications: 1,
        usedApplications: 0,
      });
    }
    const isWindowOpen = checkIsPaymentWindowOpen();
    return res.json({ success: true, subscription: sub, isPaymentWindowOpen: isWindowOpen });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST Initiate payment order
router.post("/create-order", async (req, res) => {
  try {
    const { email, plan, bypassTimeCheck } = req.body;
    if (!email || !plan || !PLAN_DETAILS[plan]) {
      return res.status(400).json({ success: false, message: "Valid email and plan are required" });
    }

    const isWindowOpen = checkIsPaymentWindowOpen();
    if (!isWindowOpen && !bypassTimeCheck) {
      return res.status(403).json({
        success: false,
        blocked: true,
        message: "Payment Access Blocked: Subscription payments are strictly permitted only between 10:00 AM and 11:00 AM IST.",
      });
    }

    const planData = PLAN_DETAILS[plan];
    const orderId = `ord_sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return res.json({
      success: true,
      orderId,
      plan,
      amount: planData.price,
      currency: "INR",
      message: "Payment order initialized.",
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST Process successful payment, update plan & send invoice email
router.post("/process-payment", async (req, res) => {
  try {
    const { email, plan, orderId, paymentId, bypassTimeCheck } = req.body;
    if (!email || !plan || !PLAN_DETAILS[plan]) {
      return res.status(400).json({ success: false, message: "Valid email and plan are required" });
    }

    const isWindowOpen = checkIsPaymentWindowOpen();
    if (!isWindowOpen && !bypassTimeCheck) {
      return res.status(403).json({
        success: false,
        blocked: true,
        message: "Payment Access Blocked: Subscription payments are strictly permitted only between 10:00 AM and 11:00 AM IST.",
      });
    }

    const planData = PLAN_DETAILS[plan];
    let sub = await Subscription.findOne({ email });
    if (!sub) {
      sub = new Subscription({ email });
    }

    const finalPaymentId = paymentId || `pay_sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const finalOrderId = orderId || `ord_sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    sub.plan = plan;
    sub.maxApplications = planData.maxApplications;
    sub.lastPaymentDate = new Date();
    sub.updatedAt = new Date();

    sub.paymentHistory.push({
      orderId: finalOrderId,
      paymentId: finalPaymentId,
      plan,
      amount: planData.price,
      timestamp: new Date(),
      invoiceSent: true,
    });

    await sub.save();

    // Send invoice email
    await sendInvoiceEmail(email, {
      planName: plan,
      amount: planData.price,
      orderId: finalOrderId,
      paymentId: finalPaymentId,
      maxApplications: planData.maxApplications,
      timestamp: new Date(),
    });

    return res.json({
      success: true,
      message: `🎉 Payment successful! You are now subscribed to the ${plan} Plan. Payment invoice has been emailed to ${email}.`,
      subscription: sub,
    });
  } catch (error) {
    console.error("Error processing subscription payment:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
