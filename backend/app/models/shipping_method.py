from app import db
from datetime import datetime


class ShippingMethod(db.Model):
    __tablename__ = 'shipping_methods'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'air', 'sea'
    origin = db.Column(db.String(100))
    rate_type = db.Column(db.String(20))  # 'per_kg', 'per_cbm'
    base_rate = db.Column(db.Numeric(10, 2))
    currency = db.Column(db.String(10), default='USD')
    transit_days_min = db.Column(db.Integer)
    transit_days_max = db.Column(db.Integer)
    schedule = db.Column(db.String(100))  # 'daily', 'weekly', etc.
    restrictions = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    shipments = db.relationship('Shipment', backref='shipping_method', lazy='dynamic')
    quotes = db.relationship('Quote', backref='shipping_method', lazy='dynamic')
    
    def to_dict(self):
        """Convert shipping method to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'origin': self.origin,
            'rate_type': self.rate_type,
            'base_rate': float(self.base_rate) if self.base_rate else None,
            'currency': self.currency,
            'transit_days': f"{self.transit_days_min}-{self.transit_days_max} days" if self.transit_days_min and self.transit_days_max else None,
            'transit_days_min': self.transit_days_min,
            'transit_days_max': self.transit_days_max,
            'schedule': self.schedule,
            'restrictions': self.restrictions,
            'is_active': self.is_active
        }
    
    def __repr__(self):
        return f'<ShippingMethod {self.name}>'
