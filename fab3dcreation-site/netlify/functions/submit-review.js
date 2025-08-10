// netlify/functions/submit-review.js
const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const { token, rating, comment, photos = [] } = JSON.parse(event.body || "{}");
  if (!token) return { statusCode: 400, body: "Missing token" };

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);
  const { data: order, error } = await supabase.from("orders").select("*").eq("review_token", token).single();
  if (error || !order) return { statusCode: 400, body: "Invalid token" };

  await supabase.from("reviews").insert({
    product_id: order.product_id,
    rating: Number(rating) || 3,
    comment: String(comment || "").slice(0, 2000),
    author_email: order.email,
    photos
  });

  await supabase.from("orders").update({ review_token: null }).eq("id", order.id);

  return { statusCode: 200, body: JSON.stringify({ ok: true, product_id: order.product_id }) };
};
