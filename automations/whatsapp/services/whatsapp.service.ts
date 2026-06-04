import { WhatsAppNotificationData, WhatsAppConfig, WhatsAppLogEntry } from "../types";
import * as templates from "../templates/messages";

export class WhatsAppService {
    private config: WhatsAppConfig;

    constructor(config: WhatsAppConfig) {
        this.config = config;
    }

    /**
     * Main entry point to send all registration-related notifications
     */
    async sendRegistrationNotifications(data: WhatsAppNotificationData, providerMobile: string, opsMobile: string) {
        const results = [];

        // 1. Send to Customer
        results.push(await this.sendDirectMessage(
            data.recipient_number, 
            templates.getCustomerConfirmation(data),
            'healthmetro_customer_confirmation',
            data.customer_id
        ));

        // 2. Send to Provider
        results.push(await this.sendDirectMessage(
            providerMobile, 
            templates.getProviderRegistrationAlert(data),
            'healthmetro_provider_registration_alert',
            data.customer_id
        ));

        // 3. Send to Ops Team
        results.push(await this.sendDirectMessage(
            opsMobile, 
            templates.getOpsAlert(data),
            'healthmetro_ops_alert',
            data.customer_id
        ));

        return results;
    }

    private async sendDirectMessage(to: string, message: string, templateName: string, customerId: string) {
        console.log(`[WhatsAppService] Sending ${templateName} to ${to}...`);
        
        let status: 'SENT' | 'FAILED' = 'SENT';
        let responsePayload: any = {};

        try {
            if (this.config.apiProvider === 'TWILIO') {
                const twilio = require('twilio');
                const client = twilio(this.config.accountSid, this.config.authToken);
                
                responsePayload = await client.messages.create({
                    body: message,
                    from: `whatsapp:${this.config.fromNumber}`,
                    to: `whatsapp:${to}`
                });
            } else {
                // Mock for other providers
                responsePayload = { mock: true, timestamp: new Date().toISOString(), success: true };
            }
        } catch (error: any) {
            console.error(`[WhatsAppService] Failed to send message to ${to}:`, error);
            status = 'FAILED';
            responsePayload = { error: error.message };
        }

        // Log the attempt (This would typically go to Supabase)
        const logEntry: WhatsAppLogEntry = {
            customer_id: customerId,
            recipient_number: to,
            template_name: templateName,
            message_status: status,
            api_response: responsePayload
        };

        await this.logToDatabase(logEntry);

        return logEntry;
    }

    private async logToDatabase(log: WhatsAppLogEntry) {
        // Implementation for Supabase logging would go here
        // supabase.from('whatsapp_logs').insert(log);
        console.log(`[WhatsAppService] Logged message status: ${log.message_status} for ${log.recipient_number}`);
    }
}
