const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

/**
 * Requests the backend to generate and send a verification code (OTP) to the recipient's email.
 */
export const sendOtpEmail = async (recipientEmail: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipientEmail }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Backend OTP send failed: Status ${response.status}. Details: ${errorData}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Network error requesting OTP:", error);
    return false;
  }
};
