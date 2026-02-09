import os
# Note: For production, integrate with Twilio or Africa's Talking


def send_sms(phone, message):
    """
    Send SMS using configured SMS service
    For production, integrate with Twilio or Africa's Talking
    """
    try:
        # Placeholder for SMS sending logic
        print(f"Sending SMS to: {phone}")
        print(f"Message: {message}")
        
        # TODO: Implement actual SMS sending
        # Example with Twilio:
        # from twilio.rest import Client
        # client = Client(account_sid, auth_token)
        # message = client.messages.create(
        #     body=message,
        #     from_=twilio_phone_number,
        #     to=phone
        # )
        
        return True
    except Exception as e:
        print(f"Error sending SMS: {str(e)}")
        return False


def send_tracking_update_sms(phone, tracking_number, status):
    """Send tracking update notification via SMS"""
    message = f"Golden Sail: Your shipment {tracking_number} is now {status}. Track: http://gs.link/{tracking_number}"
    return send_sms(phone, message)


def send_delivery_notification_sms(phone, tracking_number):
    """Send delivery notification via SMS"""
    message = f"Golden Sail: Your shipment {tracking_number} has been delivered! Thank you for choosing us."
    return send_sms(phone, message)
