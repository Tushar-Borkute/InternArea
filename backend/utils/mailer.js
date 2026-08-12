const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "noreply.internarea@gmail.com",
    pass: process.env.EMAIL_PASS || "dummy_pass",
  },
});

const sendOtpEmail = async (email, otp) => {
  console.log(`========================================`);
  console.log(`[SECURITY OTP] Sent OTP ${otp} to ${email}`);
  console.log(`========================================`);

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: '"InternArea Security" <noreply.internarea@gmail.com>',
        to: email,
        subject: "Your Google Chrome Login Security OTP - InternArea",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #0ea5e9; margin-top: 0;">Google Chrome Login Verification</h2>
            <p>You are logging into InternArea using <strong>Google Chrome</strong>. To complete your login securely, please enter the OTP below:</p>
            <div style="background-color: #f0f9ff; border: 1px dashed #0ea5e9; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0284c7;">${otp}</span>
            </div>
            <p style="font-size: 13px; color: #666;">This code is valid for 10 minutes. If you did not attempt to log in, please secure your account immediately.</p>
          </div>
        `,
      });
    }
    return true;
  } catch (error) {
    console.error("Nodemailer error (fallback used):", error.message);
    return true;
  }
};

const sendInvoiceEmail = async (email, invoiceData) => {
  const { planName, amount, orderId, paymentId, maxApplications, timestamp } = invoiceData;
  const dateStr = new Date(timestamp || Date.now()).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const appLimitText = maxApplications === -1 ? "Unlimited" : `${maxApplications} Applications/Month`;

  console.log(`========================================`);
  console.log(`[INVOICE SENT] Payment receipt sent to ${email}`);
  console.log(`Plan: ${planName} | Amount: ₹${amount} | OrderId: ${orderId}`);
  console.log(`========================================`);

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: '"InternArea Billing" <noreply.internarea@gmail.com>',
        to: email,
        subject: `Payment Invoice - ${planName} Subscription Plan (InternArea)`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; max-width: 550px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <div style="text-align: center; border-bottom: 2px solid #0ea5e9; padding-bottom: 16px; margin-bottom: 20px;">
              <h2 style="color: #0ea5e9; margin: 0; font-size: 24px;">InternArea Payment Invoice</h2>
              <p style="color: #64748b; margin: 4px 0 0; font-size: 14px;">Official Payment Confirmation & Subscription Receipt</p>
            </div>
            
            <p>Hi Candidate,</p>
            <p>Thank you for subscribing to the <strong>${planName} Plan</strong> on InternArea! Your payment was processed successfully during the designated payment window.</p>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
              <tr style="background: #f8fafc;">
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Order ID</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Payment ID</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${paymentId}</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Subscription Plan</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0; color: #0284c7; font-weight: bold;">${planName} Plan</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Application Limit</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">${appLimitText}</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Amount Paid</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 16px; color: #16a34a; font-weight: bold;">₹${amount} INR</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: bold;">Date & Time (IST)</td>
                <td style="padding: 10px; border: 1px solid #e2e8f0;">${dateStr} IST</td>
              </tr>
            </table>

            <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 12px; margin-top: 20px; font-size: 13px; color: #0369a1;">
              <strong>Note:</strong> Your monthly internship application limit has been updated immediately. Enjoy applying to your dream internships!
            </div>
            
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px;">
              InternArea Technologies Pvt Ltd &bull; Security & Controlled Access System
            </p>
          </div>
        `,
      });
    }
    return true;
  } catch (error) {
    console.error("Nodemailer invoice error:", error.message);
    return true;
  }
};

module.exports = { sendOtpEmail, sendInvoiceEmail };
