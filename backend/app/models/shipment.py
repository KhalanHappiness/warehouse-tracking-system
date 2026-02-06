from app import db
from datetime import datetime
import secrets
import string


class Shipment(db.Model):
    __tablename__ = 'shipments'
    
    id = db.Column(db.Integer, primary_key=True)
    tracking_number = db.Column(db.String(50), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    shipping_method_id = db.Column(db.Integer, db.ForeignKey('shipping_methods.id'))
    consignment_number = db.Column(db.String(100))
    
    # Cargo Details
    description = db.Column(db.Text)
    cartons = db.Column(db.Integer)
    actual_weight = db.Column(db.Numeric(10, 2))
    volume_cbm = db.Column(db.Numeric(10, 3))
    chargeable_weight = db.Column(db.Numeric(10, 2))
    
    # Pricing
    rate = db.Column(db.Numeric(10, 2))
    total_cost = db.Column(db.Numeric(10, 2))
    currency = db.Column(db.String(10), default='USD')
    
    # Status
    current_status = db.Column(db.String(50), default='pending')
    origin = db.Column(db.String(255))
    destination = db.Column(db.String(255))
    
    # Dates
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    estimated_delivery = db.Column(db.Date)
    actual_delivery = db.Column(db.Date)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tracking_events = db.relationship('TrackingEvent', backref='shipment', lazy='dynamic', 
                                     cascade='all, delete-orphan', order_by='TrackingEvent.event_time')
    
    @staticmethod
    def generate_tracking_number():
        """Generate unique tracking number"""
        prefix = 'RD'
        random_digits = ''.join(secrets.choice(string.digits) for _ in range(7))
        return f"{prefix}{random_digits}"
    
    def calculate_chargeable_weight(self):
        """Calculate chargeable weight (higher of actual or volumetric)"""
        if self.actual_weight and self.volume_cbm:
            volumetric_weight = float(self.volume_cbm) * 166  # CBM to kg conversion
            self.chargeable_weight = max(float(self.actual_weight), volumetric_weight)
        elif self.actual_weight:
            self.chargeable_weight = float(self.actual_weight)
        return self.chargeable_weight
    
    def calculate_total_cost(self):
        """Calculate total cost based on rate and chargeable weight"""
        if self.chargeable_weight and self.rate:
            self.total_cost = float(self.chargeable_weight) * float(self.rate)
        return self.total_cost
    
    def to_dict(self, include_events=True):
        """Convert shipment to dictionary"""
        data = {
            'id': self.id,
            'tracking_number': self.tracking_number,
            'consignment_number': self.consignment_number,
            'description': self.description,
            'cartons': self.cartons,
            'actual_weight': float(self.actual_weight) if self.actual_weight else None,
            'volume_cbm': float(self.volume_cbm) if self.volume_cbm else None,
            'chargeable_weight': float(self.chargeable_weight) if self.chargeable_weight else None,
            'rate': float(self.rate) if self.rate else None,
            'total_cost': float(self.total_cost) if self.total_cost else None,
            'currency': self.currency,
            'current_status': self.current_status,
            'origin': self.origin,
            'destination': self.destination,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'estimated_delivery': self.estimated_delivery.isoformat() if self.estimated_delivery else None,
            'actual_delivery': self.actual_delivery.isoformat() if self.actual_delivery else None,
            'shipping_method': self.shipping_method.to_dict() if self.shipping_method else None
        }
        
        if include_events:
            data['tracking_events'] = [event.to_dict() for event in self.tracking_events.all()]
        
        return data
    
    def __repr__(self):
        return f'<Shipment {self.tracking_number}>'
