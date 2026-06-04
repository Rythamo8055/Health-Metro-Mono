export interface WhatsAppNotificationData {
    provider_name: string;
    customer_name: string;
    customer_id: string;
    appointment_date: string;
    time_slot: string;
    collection_type: 'provider' | 'home';
    recipient_number: string;
}

export interface WhatsAppConfig {
    apiKey: string;
    accountSid?: string; // For Twilio
    authToken?: string;  // For Twilio
    fromNumber: string;
    apiProvider: 'TWILIO' | 'META_CLOUD' | 'WHATSAPP_WEB';
}

export interface WhatsAppLogEntry {
    customer_id: string;
    recipient_number: string;
    template_name: string;
    message_status: 'SENT' | 'FAILED' | 'DELIVERED';
    api_response: any;
}
