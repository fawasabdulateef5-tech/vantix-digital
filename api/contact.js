// Vercel serverless function. Sends mail through Resend (https://resend.com).
// Set these in Vercel > Project > Settings > Environment Variables:
//   RESEND_API_KEY   your Resend API key
//   CONTACT_TO_EMAIL the inbox that should receive enquiries
//   CONTACT_FROM_EMAIL a sender on a domain verified in Resend
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  const { name, email, company, service, message, website } = req.body || {};
  if (website) return res.status(200).json({ ok: true }); // honeypot
  if (!name || !email || !service || !message) return res.status(400).json({ error: "Missing required fields." });
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL)
    return res.status(501).json({ error: "The contact form is not connected to an email service yet." });
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL, to: [CONTACT_TO_EMAIL], reply_to: email,
      subject: `New enquiry: ${service} (${name})`,
      html: `<p><b>Name:</b> ${esc(name)}<br><b>Email:</b> ${esc(email)}<br><b>Company:</b> ${esc(company || "-")}<br><b>Service:</b> ${esc(service)}</p><p>${esc(message).replace(/\n/g, "<br>")}</p>`
    })
  });
  if (!r.ok) return res.status(502).json({ error: "Email delivery failed." });
  return res.status(200).json({ ok: true });
}
