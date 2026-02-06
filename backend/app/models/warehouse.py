from app import db
from datetime import datetime


class Warehouse(db.Model):
    __tablename__ = 'warehouses'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50))  # 'warehouse', 'office', 'pickup_point'
    country = db.Column(db.String(100))
    address_en = db.Column(db.Text)
    address_cn = db.Column(db.Text)
    phone_1 = db.Column(db.String(20))
    phone_2 = db.Column(db.String(20))
    email = db.Column(db.String(255))
    
    # Associations - stored as comma-separated values
    shipping_method_types = db.Column(db.String(100))  # 'air,sea'
    
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_shipping_types(self):
        """Get shipping types as list"""
        if self.shipping_method_types:
            return self.shipping_method_types.split(',')
        return []
    
    def set_shipping_types(self, types_list):
        """Set shipping types from list"""
        if types_list:
            self.shipping_method_types = ','.join(types_list)
        else:
            self.shipping_method_types = None
    
    def to_dict(self):
        """Convert warehouse to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'country': self.country,
            'address_en': self.address_en,
            'address_cn': self.address_cn,
            'phone_1': self.phone_1,
            'phone_2': self.phone_2,
            'email': self.email,
            'shipping_method_types': self.get_shipping_types(),
            'is_active': self.is_active
        }
    
    def __repr__(self):
        return f'<Warehouse {self.name}>'
