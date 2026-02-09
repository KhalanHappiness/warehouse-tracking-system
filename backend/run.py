#!/usr/bin/env python
"""
Golden Sail Logistics - Backend API
Main application entry point
"""
import os
from app import create_app, db
from app.models import User, ShippingMethod, Shipment, TrackingEvent, Quote, Warehouse, Address

app = create_app()

@app.shell_context_processor
def make_shell_context():
    """Make database models available in flask shell"""
    return {
        'db': db,
        'User': User,
        'ShippingMethod': ShippingMethod,
        'Shipment': Shipment,
        'TrackingEvent': TrackingEvent,
        'Quote': Quote,
        'Warehouse': Warehouse,
        'Address': Address
    }

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
