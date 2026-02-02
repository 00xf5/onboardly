# 📧 Email Setup Guide - Resend Integration

## ✅ What's Been Configured

Your Onboardly app now has **automatic welcome emails** using Resend! Here's what was set up:

### 1. API Key (Secured)
- ✅ Added to `.env`: `RESEND_API_KEY=re_7vyQB4nW_2aW3j4yvZWtCRXzTQimd5DFo`
- ✅ Protected in `.gitignore` (won't be committed to git)

### 2. Serverless Function
- ✅ Created: `api/send-welcome-email.ts`
- ✅ Handles POST requests to `/api/send-welcome-email`
- ✅ Beautiful HTML email template included

### 3. Email Service
- ✅ Created: `src/lib/email.ts`
- ✅ Helper function `sendWelcomeEmail(email, name)`

### 4. Signup Integration
- ✅ Updated: `src/pages/Signup.tsx`
- ✅ Automatically sends welcome email after user signup
- ✅ Non-blocking (signup works even if email fails)

---

## 🚀 Deployment Steps

### For Vercel (Recommended)

1. **Add Environment Variable to Vercel**
   ```bash
   vercel env add RESEND_API_KEY
   ```
   When prompted, enter: `re_7vyQB4nW_2aW3j4yvZWtCRXzTQimd5DFo`

   **OR** via Vercel Dashboard:
   - Go to: https://vercel.com/your-project/settings/environment-variables
   - Add: `RESEND_API_KEY` = `re_7vyQB4nW_2aW3j4yvZWtCRXzTQimd5DFo`
   - Select: Production, Preview, Development

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Done!** Welcome emails will be sent automatically on signup 🎉

---

## 🧪 Testing Locally

### Option 1: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Run development server with serverless functions
vercel dev
```

Then test signup at: `http://localhost:3000/signup`

### Option 2: Environment Variable Setup
If using `npm run dev`, create `.env.local`:
```env
RESEND_API_KEY=re_7vyQB4nW_2aW3j4yvZWtCRXzTQimd5DFo
```

---

## 📝 How It Works

1. **User signs up** → `Signup.tsx`
2. **Account created** → Firebase Auth
3. **Welcome email sent** → `/api/send-welcome-email`
4. **Email delivered** → via Resend

**Flow:**
```
User Signup
   ↓
Firebase Auth (create account)
   ↓
Firestore (save user doc)
   ↓
sendWelcomeEmail() ← non-blocking
   ↓
/api/send-welcome-email ← serverless function
   ↓
Resend API ← sends email
   ↓
✉️ User receives welcome email
```

---

## 🎨 Customizing the Email

Edit the email template in: `api/send-welcome-email.ts`

**Current template includes:**
- ✅ Orange gradient header with Onboardly branding
- ✅ Personalized greeting with user's name
- ✅ Getting started checklist
- ✅ CTA button to dashboard
- ✅ Professional footer

**To customize:**
1. Edit the `html` section in `api/send-welcome-email.ts`
2. Update the `from` field (requires domain verification on Resend)
3. Modify subject line as needed

---

## 🔧 Troubleshooting

### Email not sending?
1. Check Vercel logs: `vercel logs`
2. Verify API key is set in Vercel dashboard
3. Check Resend dashboard for delivery status

### Using custom domain?
1. Go to Resend dashboard → Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Add DNS records
4. Update `from` field: `Onboardly <welcome@yourdomain.com>`

### Testing without deployment?
Use the Resend test endpoint:
```typescript
// In your browser console after signup attempt:
fetch('/api/send-welcome-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'test@example.com', 
    name: 'Test User' 
  })
})
```

---

## 📊 Resend Free Tier Limits

- ✅ **3,000 emails/month** (free forever)
- ✅ **100 emails/day**
- ✅ Full API access
- ✅ Email analytics

Upgrade available if you need more.

---

## 🎯 Next Steps

1. **Deploy to Vercel** with environment variable
2. **Test signup** on production
3. **Verify email** arrives in inbox (check spam folder)
4. **Customize template** to match your brand
5. **Add domain** for better deliverability (optional)

---

## 📚 Additional Email Types

Want to add more emails? Create new templates:

```typescript
// src/lib/email.ts
export async function sendPasswordResetEmail(email: string) { ... }
export async function sendTeamInviteEmail(email: string, teamName: string) { ... }
```

Then create corresponding API routes in `/api/`.

---

**Need help?** Check the logs or reach out to Resend support!
