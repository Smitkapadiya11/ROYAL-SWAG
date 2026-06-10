import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SITE_ORIGIN } from "@/lib/config";

const REWARD_RUPEES = 100;

export function buildReferralCode(fullName: string, phone: string): string {
  const first = fullName.trim().split(/\s+/)[0] || "FRIEND";
  const alpha = first.replace(/[^a-zA-Z]/g, "").toUpperCase() || "FRIEND";
  const digits = phone.replace(/\D/g, "").slice(-4).padStart(4, "0");
  return `${alpha}${digits}`;
}

export function buildReferralLink(code: string): string {
  const host = SITE_ORIGIN.replace(/\/$/, "");
  return `${host}?ref=${encodeURIComponent(code)}`;
}

export async function generateReferralForOrder(orderId: string) {
  const admin = getSupabaseAdmin();

  const { data: order, error } = await admin
    .from("orders")
    .select("id, order_number, full_name, phone, status")
    .or(`id.eq.${orderId},order_number.eq.${orderId}`)
    .maybeSingle();

  if (error || !order) {
    return { error: "Order not found" as const };
  }

  if (order.status !== "paid" && order.status !== "processing" && order.status !== "shipped" && order.status !== "delivered") {
    return { error: "Order not eligible" as const };
  }

  const code = buildReferralCode(order.full_name, order.phone);

  const { data: existing } = await admin
    .from("referrals")
    .select("code")
    .eq("referrer_order_id", order.id)
    .maybeSingle();

  if (existing?.code) {
    return {
      code: existing.code,
      link: buildReferralLink(existing.code),
      orderId: order.order_number,
    };
  }

  const { error: insertErr } = await admin.from("referrals").insert({
    referrer_order_id: order.id,
    referrer_name: order.full_name,
    referrer_phone: order.phone,
    code,
    status: "pending",
    reward_amount: REWARD_RUPEES,
  });

  if (insertErr && !insertErr.message.includes("duplicate")) {
    console.error("[referral] insert:", insertErr);
    return { error: "Could not create referral code" as const };
  }

  await admin.from("wallets").upsert(
    {
      referrer_code: code,
      referrer_phone: order.phone,
      balance_paise: 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "referrer_phone" }
  );

  return {
    code,
    link: buildReferralLink(code),
    orderId: order.order_number,
  };
}

export async function trackReferralOnOrder(params: {
  referredOrderId: string;
  referralCode?: string | null;
  utmSource?: string | null;
}) {
  const code = (params.referralCode || params.utmSource || "").trim().toUpperCase();
  if (!code || code.length < 5) return { matched: false };

  const admin = getSupabaseAdmin();

  const { data: existingConversion } = await admin
    .from("referrals")
    .select("id")
    .eq("referred_order_id", params.referredOrderId)
    .maybeSingle();

  if (existingConversion) return { matched: false };

  const { data: referrer } = await admin
    .from("referrals")
    .select("*")
    .eq("code", code)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!referrer) return { matched: false };

  const rewardPaise = (referrer.reward_amount ?? REWARD_RUPEES) * 100;

  await admin.from("referrals").insert({
    referrer_order_id: referrer.referrer_order_id,
    referrer_name: referrer.referrer_name,
    referrer_phone: referrer.referrer_phone,
    code: referrer.code,
    referred_order_id: params.referredOrderId,
    status: "confirmed",
    reward_amount: REWARD_RUPEES,
  });

  const { data: wallet } = await admin
    .from("wallets")
    .select("balance_paise")
    .eq("referrer_phone", referrer.referrer_phone)
    .maybeSingle();

  const newBalance = (wallet?.balance_paise ?? 0) + rewardPaise;

  await admin.from("wallets").upsert(
    {
      referrer_code: referrer.code,
      referrer_phone: referrer.referrer_phone,
      balance_paise: newBalance,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "referrer_phone" }
  );

  await sendReferrerWhatsAppNotification(
    referrer.referrer_name,
    referrer.referrer_phone,
    REWARD_RUPEES
  );

  return { matched: true, code: referrer.code, reward: REWARD_RUPEES };
}

async function sendReferrerWhatsAppNotification(
  name: string,
  phone: string,
  amount: number
) {
  const firstName = name.trim().split(/\s+/)[0] || "there";
  const message = `${firstName}, someone used your link! ₹${amount} added to your wallet.`;
  const apiKey = process.env.MSG91_AUTH_KEY;
  if (!apiKey) {
    console.log("[referral] WhatsApp skipped:", message);
    return;
  }

  try {
    await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: {
        authkey: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template_id: process.env.MSG91_REFERRAL_TEMPLATE_ID,
        recipients: [{ mobiles: `91${phone.replace(/\D/g, "").slice(-10)}`, var1: firstName, var2: String(amount) }],
      }),
    });
  } catch (err) {
    console.error("[referral] WhatsApp error:", err);
  }
}

export async function getReferralStats(phone: string, code: string) {
  const admin = getSupabaseAdmin();
  const normalizedPhone = phone.replace(/\D/g, "").slice(-10);

  const { count: orders } = await admin
    .from("referrals")
    .select("*", { count: "exact", head: true })
    .eq("code", code)
    .not("referred_order_id", "is", null);

  const { data: wallet } = await admin
    .from("wallets")
    .select("balance_paise, referral_shares")
    .eq("referrer_phone", normalizedPhone)
    .maybeSingle();

  return {
    referralsSent: wallet?.referral_shares ?? 0,
    ordersPlaced: orders ?? 0,
    earnings: Math.round((wallet?.balance_paise ?? 0) / 100),
  };
}

export async function incrementReferralShare(phone: string): Promise<void> {
  const admin = getSupabaseAdmin();
  const normalizedPhone = phone.replace(/\D/g, "").slice(-10);
  const { data: wallet } = await admin
    .from("wallets")
    .select("referral_shares")
    .eq("referrer_phone", normalizedPhone)
    .maybeSingle();

  if (!wallet) return;

  await admin
    .from("wallets")
    .update({
      referral_shares: (wallet.referral_shares ?? 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("referrer_phone", normalizedPhone);
}
