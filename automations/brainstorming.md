# WhatsApp Integration Brainstorming - Health Metro

## 1. Vercel Integration Paths
While Vercel doesn't have a single "one-click" WhatsApp plugin, there are three primary ways to achieve this within the Vercel/Next.js ecosystem:

### A. Vercel Chat SDK (Recommended for Bots/Interactivity)
Vercel recently released a [Chat SDK](https://sdk.vercel.ai/) which includes an official WhatsApp adapter.
- **Pros**: First-party feel, handles media/voice/location out of the box, unified bot logic.
- **Cons**: Might be overkill if you only need one-way notifications.

### B. Knock (Notification Infrastructure)
[Knock](https://knock.app/) has a dedicated Vercel integration and supports WhatsApp as a channel (via Twilio or Meta).
- **Pros**: Handles multiple channels (Email, SMS, WhatsApp, Push) from one dashboard. Great for the "Operations Alert" and "Customer Confirmation" requirements.
- **Cons**: Another third-party service to manage.

### C. No-Code / Low-Code Automation (Zapier Alternatives)
If you want to test flows quickly without writing full backend logic:
- **Pipedream**: (Best for Developers) Allows you to write raw JS/TS code in between steps. Very easy to connect Supabase -> WhatsApp.
- **Make.com**: (Best Visual Flow) More powerful and cheaper than Zapier. Great for complex logic.
- **viaSocket**: Has specific Vercel templates for WhatsApp Business.
- **n8n**: Open-source and can be self-hosted. Total control over data privacy.

### D. Custom Next.js API Routes (The "Standard" Way)
Building serverless functions in your `healthmetro-admin` or `healthmetro-forms` apps to handle webhooks and send messages via Twilio or Meta's Graph API.
- **Pros**: Total control, no extra "middleman" service fees (besides the API provider).
- **Cons**: You have to write the retry logic and queueing yourself (as suggested in `10.automations.md`).

---

## 2. Recommended Providers
Based on the `10.automations.md` requirements:
1. **Meta WhatsApp Business API (Direct)**: Cheapest, but slightly more complex to set up.
2. **Twilio**: Easiest developer experience, great documentation, but more expensive per message.

---

## 3. Implementation Flow (Draft)

### Phase 1: Setup
- Create Meta Developer App.
- Get `WHATSAPP_TOKEN`, `PHONE_NUMBER_ID`, and `VERIFY_TOKEN`.
- Add these to Vercel Environment Variables.

### Phase 2: Webhook Handler
- Create `/api/whatsapp/webhook` to handle status updates (Delivered, Read).
- Implement verification handshake.

### Phase 3: Trigger Logic
- In `healthmetro-forms`, after successful registration:
  - Trigger an internal API call or a background job.
  - Send messages to **Customer**, **Provider**, and **Ops Team** using templates defined in docs.

---

## 4. Key Questions for Decision
1. **Budget vs. Speed**: Do we prefer Meta (cheaper, harder setup) or Twilio (pricier, faster setup)?
2. **Notification Volume**: How many messages per day do we expect? (Vercel serverless limits might apply for extremely high volumes).
3. **Queueing**: Should we use **Upstash Redis** (Vercel Integration) for the asynchronous queueing suggested in the docs?
