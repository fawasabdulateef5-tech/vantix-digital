# VANTIX DIGITAL – Vercel site (static HTML/CSS/JS + one serverless function)

## 1. Add your assets (download from your two Drive folders)
Folder 1 → logo + service banners; Folder 2 → portfolio. Rename/copy into:
- assets/logo/logo.png (+ favicon.png)  [already added]
- Hero: built from portfolio screenshots (no separate hero image needed)
- assets/services/website-design.jpg, social-media-marketing.jpg, social-media-management.jpg, crm-setup-automation.jpg, ecommerce.jpg, seo-sem.jpg
  (or edit the filenames in js/data.js)
- assets/portfolio/*  and list each file in the PORTFOLIO array in js/data.js
Any missing image shows a navy box naming the file it expects.

## 2. Hero text
index.html has a comment above the hero. Paste your current Lovable hero headline/copy there if it differs.

## 3. Contact form
It posts to /api/contact (api/contact.js) which emails via Resend. In Vercel → Settings → Environment Variables add:
RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL (sender on a Resend-verified domain).
Until set, the form shows an error instead of pretending to send.

## 4. Deploy
Push to GitHub → Vercel "Add New Project" → framework preset "Other", no build command. Or: `npx vercel`.
Add real contact details/social links in js/main.js footer once confirmed.
