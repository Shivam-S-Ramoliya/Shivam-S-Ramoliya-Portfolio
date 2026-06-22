const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "btechictresourcecenter@gmail.com";
const SENDER_NAME = process.env.BREVO_SENDER_NAME || "Shivam S. Ramoliya";
const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
if (MONGODB_URL) {
  mongoose.connect(MONGODB_URL, { dbName: 'portfolio' })
    .then(() => console.log('Connected to MongoDB successfully.'))
    .catch((err) => console.error('MongoDB connection error:', err));
} else {
  console.warn("WARNING: MONGODB_URL is not defined in environment variables.");
}

// Mongoose Schemas & Models
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // automatic expiry in 5 minutes (TTL index)
});
const Otp = mongoose.model('Otp', otpSchema);

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: "" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

app.get('/', (req, res) => {
  res.send('Shivam Portfolio Secure Email Service API is running.');
});

// Endpoint to generate and send OTP, storing it in MongoDB
app.post('/api/send-otp', async (req, res) => {
  const { recipientEmail } = req.body;
  if (!recipientEmail) {
    return res.status(400).json({ error: 'Missing recipientEmail' });
  }

  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Save or update OTP in MongoDB (expires automatically after 5 minutes)
    await Otp.findOneAndUpdate(
      { email: recipientEmail },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    if (!BREVO_API_KEY) {
      console.log(`[SIMULATED OTP] To: ${recipientEmail}, OTP: ${otpCode}`);
      return res.status(200).json({ message: 'OTP send simulated successfully (check server logs)', simulated: true });
    }

    // Send OTP email via Brevo REST API with the requested banner layout (Non-black dark mode)
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: recipientEmail }],
        subject: "Verification Code - Shivam S. Ramoliya",
        htmlContent: `
          <div style="background-color: #080b11; padding: 30px 15px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; width: 100%; box-sizing: border-box;">
            <div style="max-width: 550px; margin: 0 auto; background-color: #111622; border-radius: 16px; overflow: hidden; box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.05);">
              
              <!-- Gradient Header -->
              <div style="background: linear-gradient(135deg, #00b4d8 0%, #7209b7 100%); padding: 35px 20px; text-align: center;">
                <h1 style="margin: 0 0 8px 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Verification Required 🔐</h1>
                <p style="margin: 0; color: rgba(255, 255, 255, 0.85); font-size: 13px; font-weight: 400;">Confirm your identity to submit the contact form</p>
              </div>

              <!-- Content Body -->
              <div style="padding: 35px 30px; text-align: left;">
                <h2 style="color: #ffffff; font-size: 17px; font-weight: 600; margin: 0 0 10px 0;">Hi there,</h2>
                <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; font-weight: 300;">
                  Thank you for reaching out. Please verify your email to complete sending your message by using the code below.
                </p>

                <!-- OTP Box -->
                <div style="background-color: #0a0e17; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                  <span style="color: #00b4d8; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; display: block; margin-bottom: 12px;">ONE-TIME VERIFICATION CODE</span>
                  <div style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #ffffff; text-shadow: 0 0 10px rgba(0, 180, 216, 0.3); display: inline-block;">
                    ${otpCode}
                  </div>
                </div>

                <div style="border-left: 3px solid #00b4d8; padding-left: 14px; margin: 0 0 24px 0; background: rgba(0, 180, 216, 0.03); padding-top: 10px; padding-bottom: 10px; border-radius: 0 8px 8px 0;">
                  <span style="color: #ffffff; font-size: 13px; font-weight: 500; display: block;">⏱️ Expiration Time</span>
                  <p style="color: #9ca3af; font-size: 12.5px; margin: 3px 0 0 0; line-height: 1.4;">This security code will automatically expire in 5 minutes.</p>
                </div>
              </div>

              <!-- Gradient Footer -->
              <div style="background: linear-gradient(135deg, #00b4d8 0%, #7209b7 100%); padding: 24px 20px; text-align: center;">
                <span style="color: #ffffff; font-size: 14px; font-weight: 600; display: block; margin-bottom: 2px;">Security Alert</span>
                <span style="color: rgba(255, 255, 255, 0.85); font-size: 11px; display: block; font-weight: 300;">Shivam S. Ramoliya &bull; Portfolio Service</span>
              </div>
            </div>
            <p style="color: #4b5563; font-size: 11px; margin-top: 15px;">ℹ️ This is an automated security email. Please do not reply to this message.</p>
          </div>
        `,
      }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      console.error(`Brevo API failed. Status: ${response.status}. Response: ${responseText}`);
      return res.status(response.status).json({ error: 'Brevo API error', details: responseText });
    }

    return res.status(200).json({ success: true, message: 'OTP sent and stored successfully.' });
  } catch (error) {
    console.error("Error in /api/send-otp:", error);
    return res.status(500).json({ error: 'Failed to send/store OTP', details: error.message });
  }
});

// Endpoint to verify OTP, store contact message, send notification to Shivam, and send auto-reply to sender
app.post('/api/send-contact', async (req, res) => {
  const { otpCode, formData, shivamEmail } = req.body;
  if (!otpCode || !formData || !shivamEmail) {
    return res.status(400).json({ error: 'Missing otpCode, formData, or shivamEmail' });
  }

  try {
    // 1. Verify OTP from MongoDB
    const otpRecord = await Otp.findOne({ email: formData.email });
    if (!otpRecord) {
      return res.status(400).json({ error: 'Verification code expired or not found. Please request a new code.' });
    }

    if (otpRecord.otp !== otpCode) {
      return res.status(400).json({ error: 'Invalid verification code. Please check your email.' });
    }

    // OTP verified successfully -> delete it from database
    await Otp.deleteOne({ _id: otpRecord._id });

    // 2. Store contact message in MongoDB
    const newMessage = new ContactMessage({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    });
    await newMessage.save();

    if (!BREVO_API_KEY) {
      console.log(`[SIMULATED CONTACT EMAIL]`, formData);
      return res.status(200).json({ message: 'Message stored and simulated successfully', simulated: true });
    }

    // 3. Send Notification to Shivam AND Auto-Reply to Sender in parallel
    const notificationEmailPromise = fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: shivamEmail }],
        replyTo: { email: formData.email, name: formData.name },
        subject: `New Contact Message: ${formData.subject || "No Subject"}`,
        htmlContent: `
          <div style="background-color: #080b11; padding: 30px 15px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; width: 100%; box-sizing: border-box;">
            <div style="max-width: 550px; margin: 0 auto; background-color: #111622; border-radius: 16px; overflow: hidden; box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.05);">
              
              <!-- Gradient Header -->
              <div style="background: linear-gradient(135deg, #00b4d8 0%, #7209b7 100%); padding: 35px 20px; text-align: center;">
                <h1 style="margin: 0 0 8px 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">New Contact Message</h1>
                <p style="margin: 0; color: rgba(255, 255, 255, 0.85); font-size: 13px; font-weight: 400;">Portfolio contact form notification</p>
              </div>

              <!-- Content Body -->
              <div style="padding: 35px 30px; text-align: left;">
                
                <!-- Sender details card -->
                <div style="background-color: #0a0e17; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                  <span style="color: #00b4d8; font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; display: block; margin-bottom: 12px;">SENDER DETAILS</span>
                  <div style="color: #ffffff; font-size: 16px; font-weight: 600; margin-bottom: 4px;">${formData.name}</div>
                  <div style="color: #00b4d8; font-size: 13.5px; margin-bottom: 14px;">${formData.email}</div>
                  
                  <span style="color: #6b7280; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 3px;">SUBJECT</span>
                  <div style="color: #ffffff; font-size: 14px; font-weight: 500;">${formData.subject || "No Subject"}</div>
                </div>

                <!-- Message Box -->
                <div style="margin-bottom: 28px;">
                  <span style="color: #6b7280; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 6px; font-weight: 600;">Message</span>
                  <div style="color: #cbd5e1; font-size: 13.5px; line-height: 1.6; background-color: #0a0e17; border: 1px solid rgba(255, 255, 255, 0.04); padding: 16px; border-radius: 10px; white-space: pre-wrap; font-style: italic;">
                    "${formData.message}"
                  </div>
                </div>

                <!-- Reply Button -->
                <div style="text-align: center; margin-bottom: 10px;">
                  <a href="mailto:${formData.email}" style="display: inline-block; background-color: #00b4d8; color: #050810; padding: 14px 28px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none; transition: background-color 0.2s ease;">
                    Reply to ${formData.name}
                  </a>
                </div>
              </div>

              <!-- Gradient Footer -->
              <div style="background: linear-gradient(135deg, #00b4d8 0%, #7209b7 100%); padding: 20px; text-align: center;">
                <span style="color: #ffffff; font-size: 12px; font-weight: 400;">Automated notification from your portfolio website</span>
              </div>
            </div>
          </div>
        `,
      }),
    });

    const autoReplyEmailPromise = fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: formData.email }],
        subject: `Message Received! Thank you - Shivam S. Ramoliya`,
        htmlContent: `
          <div style="background-color: #080b11; padding: 30px 15px; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; width: 100%; box-sizing: border-box;">
            <div style="max-width: 550px; margin: 0 auto; background-color: #111622; border-radius: 16px; overflow: hidden; box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.05);">
              
              <!-- Gradient Header -->
              <div style="background: linear-gradient(135deg, #00b4d8 0%, #7209b7 100%); padding: 35px 20px; text-align: center;">
                <h1 style="margin: 0 0 8px 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Message Received! ✅</h1>
                <p style="margin: 0; color: rgba(255, 255, 255, 0.85); font-size: 13px; font-weight: 400;">Thanks &mdash; I got your message and will reply soon.</p>
              </div>

              <!-- Content Body -->
              <div style="padding: 35px 30px; text-align: left;">
                <h2 style="color: #ffffff; font-size: 17px; font-weight: 600; margin: 0 0 10px 0;">Hi ${formData.name},</h2>
                <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; font-weight: 300;">
                  Thanks for reaching out &mdash; I've received your message and typically reply within 24&ndash;48 hours.
                </p>

                <!-- Message Summary container -->
                <div style="background-color: #0a0e17; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                  <span style="color: #00b4d8; font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; display: block; margin-bottom: 12px;">📋 YOUR MESSAGE SUMMARY</span>
                  
                  <span style="color: #6b7280; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 3px;">SUBJECT</span>
                  <div style="color: #ffffff; font-size: 14.5px; font-weight: 600; margin-bottom: 14px;">${formData.subject || "No Subject"}</div>

                  <span style="color: #6b7280; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 6px;">YOUR MESSAGE</span>
                  <div style="color: #cbd5e1; font-size: 13.5px; line-height: 1.6; background-color: #111622; padding: 14px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.03); white-space: pre-wrap; font-style: italic;">
                    "${formData.message}"
                  </div>
                </div>

                <!-- Response Time Callout -->
                <div style="border-left: 3px solid #00b4d8; padding-left: 14px; margin: 0 0 28px 0; background: rgba(0, 180, 216, 0.03); padding-top: 10px; padding-bottom: 10px; border-radius: 0 8px 8px 0;">
                  <p style="color: #9ca3af; font-size: 13px; margin: 0; line-height: 1.4;">
                    <strong>⏱️ Response Time:</strong> I typically respond within 24&ndash;48 hours on business days.
                  </p>
                </div>

                <!-- Next steps -->
                <h3 style="color: #ffffff; font-size: 15px; font-weight: 600; margin: 0 0 12px 0;">What happens next?</h3>
                <ul style="color: #cbd5e1; font-size: 13.5px; line-height: 1.8; margin: 0 0 28px 0; padding-left: 20px; font-weight: 300;">
                  <li>I'll review your message carefully</li>
                  <li>You'll get a personalized response from me</li>
                  <li>We can discuss your project or inquiry in detail</li>
                </ul>

                <!-- Links dock -->
                <div style="text-align: center; font-size: 13px; color: #9ca3af; margin-bottom: 8px;">
                  In the meantime, feel free to check out my work:<br />
                  <div style="margin-top: 10px;">
                    <a href="https://github.com/Shivam-S-Ramoliya" style="color: #00b4d8; text-decoration: none; font-weight: 600; margin: 0 8px;">💻 GitHub</a>
                    <a href="https://linkedin.com" style="color: #00b4d8; text-decoration: none; font-weight: 600; margin: 0 8px;">💼 LinkedIn</a>
                    <a href="https://twitter.com" style="color: #00b4d8; text-decoration: none; font-weight: 600; margin: 0 8px;">𝕏 Twitter</a>
                  </div>
                </div>
              </div>

              <!-- Gradient Footer -->
              <div style="background: linear-gradient(135deg, #00b4d8 0%, #7209b7 100%); padding: 24px 20px; text-align: center;">
                <span style="color: #ffffff; font-size: 13px; display: block; font-weight: 300; margin-bottom: 2px;">Best regards,</span>
                <span style="color: #ffffff; font-size: 16px; font-weight: 700; display: block; margin-bottom: 2px;">Shivam S. Ramoliya</span>
                <span style="color: rgba(255, 255, 255, 0.85); font-size: 12px; display: block; font-weight: 300;">Web Developer & Designer</span>
              </div>
            </div>
            <p style="color: #4b5563; font-size: 11px; text-align: center; margin-top: 15px;">📧 This is an automated confirmation email. Please do not reply to this message.</p>
          </div>
        `,
      }),
    });

    const [notifyResponse, replyResponse] = await Promise.all([notificationEmailPromise, autoReplyEmailPromise]);

    if (!notifyResponse.ok || !replyResponse.ok) {
      console.warn("One or both email deliveries failed.", {
        notificationStatus: notifyResponse.status,
        replyStatus: replyResponse.status
      });
    }

    return res.status(200).json({ success: true, message: 'Message verified, stored in database, and emails sent.' });
  } catch (error) {
    console.error("Error in /api/send-contact:", error);
    return res.status(500).json({ error: 'Failed to process message', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
