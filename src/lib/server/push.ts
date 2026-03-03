// src/lib/server/push.ts

import webpush from "web-push";
import mongoose from "mongoose";

// ===============================
// 🔐 VAPID Setup
// ===============================

const VAPID_SUBJECT = process.env.VAPID_SUBJECT;
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

if (VAPID_SUBJECT && VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
} else {
  console.warn("Push disabled: Missing VAPID keys");
}

// ===============================
// 📦 Subscription Model
// ===============================

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    subscription: { type: Object, required: true },
    userAgent: { type: String },
    createdAt: { type: Date, default: Date.now }
  }
);

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);

// ===============================
// 🔔 Send Push (Advanced)
// ===============================

export async function sendPushNotification({
  title,
  body,
  url = "/dashboard",
  icon = "/icons/icon-192.png",
  mailId,
  silent = false
}: {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  mailId?: string;
  silent?: boolean;
}) {
  if (!VAPID_PRIVATE_KEY) return { success: false };

  try {
    const subs = await Subscription.find({});

    if (!subs.length) {
      return { success: true };
    }

    const payload = JSON.stringify({
      title,
      body,
      icon,
      url: mailId ? `/dashboard/inbox?mail=${mailId}` : url,
      silent,
      timestamp: Date.now()
    });

    const promises = subs.map(async (sub: any) => {
      try {
        await webpush.sendNotification(sub.subscription, payload);
      } catch (err: any) {
        // Remove dead subscriptions
        if (err.statusCode === 410 || err.statusCode === 404) {
          await Subscription.findByIdAndDelete(sub._id);
        } else {
          console.error("Push send error:", err.message);
        }
      }
    });

    await Promise.all(promises);

    return { success: true };
  } catch (err) {
    console.error("Push fatal:", err);
    return { success: false };
  }
}

// ===============================
// 💾 Save Subscription
// ===============================

export async function saveSubscription({
  subscription,
  userId,
  userAgent
}: {
  subscription: any;
  userId: string;
  userAgent?: string;
}) {
  if (!subscription?.endpoint) {
    throw new Error("Invalid subscription");
  }

  const existing = await Subscription.findOne({
    "subscription.endpoint": subscription.endpoint
  });

  if (!existing) {
    await Subscription.create({
      userId,
      subscription,
      userAgent: userAgent || "Unknown Device"
    });
  }

  return { success: true };
}

// ===============================
// 🗑 Remove Subscription
// ===============================

export async function removeSubscription(endpoint: string) {
  await Subscription.deleteOne({
    "subscription.endpoint": endpoint
  });

  return { success: true };
}