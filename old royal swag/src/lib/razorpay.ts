import Razorpay from "razorpay";

let client: Razorpay | null = null;

/**
 * Returns a lazily-initialised Razorpay singleton.
 * Called at request time — never at module load / build time.
 * Throws clearly if env vars are missing.
 */
export function getRazorpayClient(): Razorpay {
  const keyId     = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || keyId.trim() === "") {
    throw new Error(
      "[Razorpay] RAZORPAY_KEY_ID is missing. " +
      "Add it to .env.local and Vercel environment variables."
    );
  }
  if (!keySecret || keySecret.trim() === "") {
    throw new Error(
      "[Razorpay] RAZORPAY_KEY_SECRET is missing. " +
      "NEVER expose this to the browser. Server-side only."
    );
  }

  if (!client) {
    client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }

  return client;
}
