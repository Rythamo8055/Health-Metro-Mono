# Healthmetro® WhatsApp Automations

This folder contains the WhatsApp integration logic for the Healthmetro® Blood Collection system as per `instructions/10.automations.md`.

## Features
- **Automated Templates**: Standardized messages for Customers, Providers, and Operations.
- **Conditional Logic**: Custom messages based on collection type (Home vs Provider).
- **Logging**: SQL migration provided for `whatsapp_logs` table.
- **Scalable Service**: `WhatsAppService` designed to be easily swapped between Twilio, Meta Cloud API, or other providers.

## Implementation Status
- [x] Folder structure and types defined.
- [x] Message templates implemented.
- [x] Core service logic implemented (asynchronous-ready).
- [x] Database logging schema prepared.
- [ ] API Provider Configuration (Requires API Keys from Twilio/Meta).
- [ ] Integration with Registration Trigger (Supabase Functions or Next.js API Routes).

## Setup Instructions

1. **Database Migration**:
   Run the SQL in `automations/whatsapp/whatsapp-logs-migration.sql` in your Supabase SQL Editor.

2. **Environment Variables**:
   Add the following to your `.env` file:
   ```env
   WHATSAPP_API_PROVIDER=TWILIO # or META_CLOUD
   WHATSAPP_FROM_NUMBER=+1415XXXXXXX
   WHATSAPP_ACCOUNT_SID=your_sid
   WHATSAPP_AUTH_TOKEN=your_token
   OPS_WHATSAPP_NUMBER=+91XXXXXXXXXX
   ```

3. **Usage**:
   ```typescript
   const ws = new WhatsAppService(config);
   await ws.sendRegistrationNotifications(data, providerMobile, opsMobile);
   ```

## Files
- `whatsapp/services/whatsapp.service.ts`: Core sending logic.
- `whatsapp/templates/messages.ts`: Message formatting.
- `whatsapp/types.ts`: TypeScript interfaces.
- `whatsapp/whatsapp-logs-migration.sql`: Tracking table.
