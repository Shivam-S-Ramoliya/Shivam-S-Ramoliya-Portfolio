import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiDownload, FiCheckCircle, FiShield } from "react-icons/fi";
import { MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import { portfolioData } from "../data/portfolioData.jsx";
import { sendOtpEmail } from "../services/otpService";
import { sendContactEmail } from "../services/contactService";

const Contact = () => {
  const { email: shivamEmail, phone, location, socialLinks } = portfolioData.contact;
  const { pdfUrl } = portfolioData.resume;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // OTP Verification States
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userOtp, setUserOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setOtpError("");

    const success = await sendOtpEmail(formData.email);
    setIsSubmitting(false);

    if (success) {
      setIsOtpSent(true);
    } else {
      setSubmitStatus("error");
      setStatusMessage("Failed to send verification email. Please try again later.");
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOtpError("");

    const success = await sendContactEmail(userOtp, formData, shivamEmail);
    setIsSubmitting(false);

    if (success) {
      setSubmitStatus("success");
      setStatusMessage("Message sent successfully! I'll get back to you shortly.");
      setIsOtpSent(false);
      setUserOtp("");
    } else {
      setOtpError("Invalid verification code. Please check your email and try again.");
    }
  };

  const handleResendOtp = async () => {
    setResendStatus("sending");
    setOtpError("");

    const success = await sendOtpEmail(formData.email);
    if (success) {
      setResendStatus("success");
      setTimeout(() => setResendStatus("idle"), 3000);
    } else {
      setResendStatus("error");
      setOtpError("Failed to resend verification email. Please try again.");
    }
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <div className="contact-grid">
          {/* Left Column: Info */}
          <div className="contact-info-panel">
            <h2 className="contact-panel-title">
              Let's work <br />
              <span>together.</span>
            </h2>
            <p className="contact-panel-subtitle">
              I'm currently available for freelance projects and open to full-time opportunities.
              If you have a project that needs some creative touch, I'd love to hear about it.
            </p>

            <div className="contact-details-list">
              <div className="contact-details-item">
                <div className="contact-icon-box">
                  <FiMail />
                </div>
                <a href={`mailto:${shivamEmail}`} className="contact-details-link">
                  {shivamEmail}
                </a>
              </div>
              <div className="contact-details-item">
                <div className="contact-icon-box">
                  <FiPhone />
                </div>
                <a href={`tel:${phone}`} className="contact-details-link">
                  {phone}
                </a>
              </div>
              <div className="contact-details-item">
                <div className="contact-icon-box">
                  <FiMapPin />
                </div>
                <span className="contact-details-text">{location}</span>
              </div>
            </div>

            {/* Social Links Dock */}
            <div className="contact-social-dock">
              {socialLinks?.map((social: any, index: number) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-social-circle"
                  title={social.name}
                  data-cursor="disable"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="contact-download-btn"
                data-cursor="disable"
              >
                <FiDownload /> Download Resume
              </a>
            )}
          </div>

          {/* Right Column: Form Panel */}
          <div className="contact-form-panel">
            {!isOtpSent && submitStatus !== "success" ? (
              <form onSubmit={handleFormSubmit} className="contact-form-card">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project inquiry"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    rows={5}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={`form-submit-btn ${isSubmitting ? "submitting" : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending Code..." : "Send Message"}
                </button>

                {submitStatus === "error" && (
                  <div className="form-alert-error">{statusMessage}</div>
                )}
              </form>
            ) : isOtpSent ? (
              <form onSubmit={handleOtpVerify} className="contact-form-card verify-card">
                <div className="verify-icon-box">
                  <FiShield />
                </div>
                <h3>Verify your email</h3>
                <p className="verify-text">
                  We've sent a 6-digit verification code to <br />
                  <strong>{formData.email}</strong>. Please enter it below.
                </p>

                <div className="form-group">
                  <input
                    type="text"
                    value={userOtp}
                    onChange={(e) => setUserOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="otp-input"
                    required
                  />
                </div>

                {otpError && <div className="form-alert-error">{otpError}</div>}

                <div className="verify-actions">
                  <button
                    type="submit"
                    className={`form-submit-btn ${isSubmitting ? "submitting" : ""}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Verifying..." : "Verify & Send"}
                  </button>
                  <button
                    type="button"
                    className="verify-resend-btn"
                    onClick={handleResendOtp}
                    disabled={resendStatus === "sending" || isSubmitting}
                  >
                    {resendStatus === "sending"
                      ? "Resending..."
                      : resendStatus === "success"
                      ? "OTP Resent Successfully!"
                      : "Resend Code"}
                  </button>
                  <button
                    type="button"
                    className="verify-back-btn"
                    onClick={() => {
                      setIsOtpSent(false);
                      setOtpError("");
                    }}
                  >
                    Back to form
                  </button>
                </div>
              </form>
            ) : (
              <div className="contact-form-card success-card">
                <div className="success-icon-box" style={{ animation: "scaleUp 0.5s ease-out" }}>
                  <FiCheckCircle />
                </div>
                <h3 style={{ background: "linear-gradient(90deg, #3b82f6 0%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>
                  Message Delivered!
                </h3>
                <p className="success-text" style={{ marginBottom: "18px" }}>
                  Your message has been sent successfully. A copy and confirmation receipt have been dispatched to your email.
                </p>

                <div className="success-summary-card" style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "left",
                  width: "100%",
                  marginBottom: "24px",
                  boxSizing: "border-box"
                }}>
                  <h4 style={{ color: "#a855f7", margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>Receipt</h4>
                  <div style={{ marginBottom: "8px", fontSize: "14px" }}><span style={{ color: "#6b7280" }}>Name:</span> <span style={{ color: "#fff", marginLeft: "6px" }}>{formData.name}</span></div>
                  <div style={{ marginBottom: "8px", fontSize: "14px" }}><span style={{ color: "#6b7280" }}>Email:</span> <span style={{ color: "#fff", marginLeft: "6px" }}>{formData.email}</span></div>
                  {formData.subject && <div style={{ marginBottom: "8px", fontSize: "14px" }}><span style={{ color: "#6b7280" }}>Subject:</span> <span style={{ color: "#fff", marginLeft: "6px" }}>{formData.subject}</span></div>}
                  <div style={{ fontSize: "14px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "10px", marginTop: "10px" }}>
                    <span style={{ color: "#6b7280", display: "block", marginBottom: "4px" }}>Message:</span>
                    <p style={{ color: "#d1d5db", margin: 0, fontSize: "13.5px", fontStyle: "italic", whiteSpace: "pre-wrap", lineHeight: "1.5" }}>"{formData.message}"</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="success-reset-btn"
                  onClick={() => {
                    setSubmitStatus("idle");
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                >
                  Send another message
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="contact-footer">
          <div className="contact-footer-copyright">
            <MdCopyright /> {new Date().getFullYear()} {portfolioData.personal.name}. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
