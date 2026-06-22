const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Sends the contact form and verification code (OTP) to the backend for verification, database storage, and email sending.
 */
export const sendContactEmail = async (
  otpCode: string,
  formData: ContactFormData,
  shivamEmail: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/send-contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otpCode, formData, shivamEmail }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Backend contact send failed: Status ${response.status}. Details: ${errorData}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Network error sending contact submission:", error);
    return false;
  }
};
