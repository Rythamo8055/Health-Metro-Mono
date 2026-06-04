import { WhatsAppNotificationData } from "../types";

export const getProviderRegistrationAlert = (data: WhatsAppNotificationData): string => {
    return `🟢 Healthmetro®

Dear ${data.provider_name},

A new customer has successfully registered for blood sample collection through your Healthmetro® QR registration link.

Customer Details:

👤 ${data.customer_name}
🆔 ${data.customer_id}
📅 ${data.appointment_date}
⏰ ${data.time_slot}
🩸 ${data.collection_type.toUpperCase()} COLLECTION

✅ Appointment confirmed successfully.

Thank you for your continued support and partnership with Healthmetro®.`;
};

export const getCustomerConfirmation = (data: WhatsAppNotificationData): string => {
    let collectionLine = "";
    if (data.collection_type === 'home') {
        collectionLine = "\n🏠 Our Healthmetro® collection staff will visit your location during the selected time slot.";
    } else {
        collectionLine = "\n🏥 Please visit the healthcare provider during your selected appointment time.";
    }

    return `🟢 Healthmetro®

Dear ${data.customer_name},

Thank you for registering with Healthmetro®.

Your blood sample collection appointment has been confirmed successfully. ✅

🆔 Customer ID: ${data.customer_id}
🏥 Provider: ${data.provider_name}
📅 Date: ${data.appointment_date}
⏰ Time: ${data.time_slot}
🩸 Collection Type: ${data.collection_type.toUpperCase()} COLLECTION
${collectionLine}

Our team will assist you during your scheduled appointment.

Thank you for choosing Healthmetro®.

We look forward to serving you.`;
};

export const getOpsAlert = (data: WhatsAppNotificationData): string => {
    return `🟢 Healthmetro®

New blood collection booking received.

👤 ${data.customer_name}
🆔 ${data.customer_id}
🏥 ${data.provider_name}
📅 ${data.appointment_date}
⏰ ${data.time_slot}
🩸 ${data.collection_type.toUpperCase()} COLLECTION

Please proceed with collection coordination.`;
};
