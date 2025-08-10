// netlify/functions/review-upload-urls.js
const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const { token, files } = JSON.parse(event.body || "{}");
  if (!token) return { statusCode: 400, body: "Missing token" };

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);
  const { data: order, error } = await supabase
    .from("orders")
    .select("id,email,product_id,review_token")
    .eq("review_token", token)
    .single();

  if (error || !order) return { statusCode: 400, body: "Invalid token" };

  const urls = [];
  for (const f of (files || []).slice(0, 3)) {
    const path = `${order.product_id}/${order.id}/${f.name}`;
    const { data, error } = await supabase.storage.from("reviews-photos").createSignedUploadUrl(path);
    if (error) return { statusCode: 500, body: error.message };
    const pub = supabase.storage.from("reviews-photos").getPublicUrl(path);
    urls.push({ url: data.signedUrl, publicUrl: pub.data.publicUrl });
  }
  return { statusCode: 200, body: JSON.stringify({ urls }) };
};
