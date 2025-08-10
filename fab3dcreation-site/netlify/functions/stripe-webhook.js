// netlify/functions/stripe-webhook.js
const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const stripe = new Stripe(process.env.STRIPE_SECRET);
  const sig = event.headers["stripe-signature"];
  let evt;
  try {
    evt = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return { statusCode: 400, body: `Bad signature: ${e.message}` };
  }

  if (evt.type === "checkout.session.completed") {
    const s = evt.data.object;
    const product_id = (s.metadata && s.metadata.product_id) || "unknown";
    const email = (s.customer_details && s.customer_details.email) || null;

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

    const { data, error } = await supabase
      .from("orders")
      .insert({ product_id, email, stripe_session_id: s.id })
      .select("review_token, email, product_id")
      .single();

    if (error) return { statusCode: 500, body: error.message };

    // TODO: send email with the review URL using your provider (Resend/Brevo/etc.)
    // const reviewUrl = `https://YOUR_DOMAIN/?token=${data.review_token}`;

    return { statusCode: 200, body: "ok" };
  }

  return { statusCode: 200, body: "ignored" };
};
