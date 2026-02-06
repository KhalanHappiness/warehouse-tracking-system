from app import db
from datetime import datetime


class Address(db.Model):
    __tablename__ = 'addresses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    label = db.Column(db.String(100))  # 'home', 'office', etc.
    full_name = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    address_line1 = db.Column(db.Text)
    address_line2 = db.Column(db.Text)
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert address to dictionary"""
        return {
            'id': self.id,
            'label': self.label,
            'full_name': self.full_name,
            'phone': self.phone,
            'address_line1': self.address_line1,
            'address_line2': self.address_line2,
            'city': self.city,
            'country': self.country,
            'is_default': self.is_default
        }
    
    def __repr__(self):
        return f'<Address {self.label} - {self.city}>'
