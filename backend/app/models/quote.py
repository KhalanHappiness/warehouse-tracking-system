from app import db
from datetime import datetime, timedelta
import secrets
import string


class Quote(db.Model):
    __tablename__ = 'quotes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    shipping_method_id = db.Column(db.Integer, db.ForeignKey('shipping_methods.id'))
    
    # Quote Details
    quote_number = db.Column(db.String(50), unique=True)
    actual_weight = db.Column(db.Numeric(10, 2))
    volume_cbm = db.Column(db.Numeric(10, 3))
    chargeable_weight = db.Column(db.Numeric(10, 2))
    
    # Pricing
    rate = db.Column(db.Numeric(10, 2))
    total_cost = db.Column(db.Numeric(10, 2))
    currency = db.Column(db.String(10), default='USD')
    
    status = db.Column(db.String(20), default='draft')  # 'draft', 'sent', 'accepted', 'expired'
    valid_until = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


   
    
    @staticmethod
    def generate_quote_number():
        """Generate unique quote number"""
        prefix = 'QT'
        random_chars = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))
        return f"{prefix}{random_chars}"
    
    def calculate_chargeable_weight(self):
        """Calculate chargeable weight (higher of actual or volumetric)"""
        if self.actual_weight and self.volume_cbm:
            volumetric_weight = float(self.volume_cbm) * 166  # CBM to kg conversion
            self.chargeable_weight = max(float(self.actual_weight), volumetric_weight)
        elif self.actual_weight:
            self.chargeable_weight = float(self.actual_weight)
        return self.chargeable_weight
    
    def calculate_total_cost(self):
        """Calculate total cost based on shipping method rate"""
        print(f"DEBUG - chargeable_weight: {self.chargeable_weight}")
        print(f"DEBUG - rate: {self.rate}")
        print(f"DEBUG - volume_cbm: {self.volume_cbm}")
        
        if self.chargeable_weight and self.rate:
            # Get shipping method from relationship or database
            shipping_method = self.shipping_method
            if not shipping_method and self.shipping_method_id:
                from app.models.shipping_method import ShippingMethod
                shipping_method = ShippingMethod.query.get(self.shipping_method_id)
            
            print(f"DEBUG - shipping_method: {shipping_method}")
            print(f"DEBUG - rate_type: {shipping_method.rate_type if shipping_method else 'None'}")
            
            if shipping_method:
                if shipping_method.rate_type == 'per_kg':
                    self.total_cost = float(self.chargeable_weight) * float(self.rate)
                    print(f"DEBUG - Calculated per_kg: {self.total_cost}")
                elif shipping_method.rate_type == 'per_cbm' and self.volume_cbm:
                    self.total_cost = float(self.volume_cbm) * float(self.rate)
                    print(f"DEBUG - Calculated per_cbm: {self.total_cost}")
            else:
                # Default to per_kg if shipping method not found
                self.total_cost = float(self.chargeable_weight) * float(self.rate)
                print(f"DEBUG - Calculated default: {self.total_cost}")
        else:
            print(f"DEBUG - Condition failed: chargeable_weight={self.chargeable_weight}, rate={self.rate}")
        
        print(f"DEBUG - Final total_cost: {self.total_cost}")
        return self.total_cost
    
    def set_validity(self, days=30):
        """Set quote validity period"""
        self.valid_until = datetime.utcnow().date() + timedelta(days=days)
    
    def to_dict(self):
        """Convert quote to dictionary"""
        return {
            'id': self.id,
            'quote_number': self.quote_number,
            'actual_weight': float(self.actual_weight) if self.actual_weight else None,
            'volume_cbm': float(self.volume_cbm) if self.volume_cbm else None,
            'chargeable_weight': float(self.chargeable_weight) if self.chargeable_weight else None,
            'rate': float(self.rate) if self.rate else None,
            'total_cost': float(self.total_cost) if self.total_cost else None,
            'currency': self.currency,
            'status': self.status,
            'valid_until': self.valid_until.isoformat() if self.valid_until else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'shipping_method': self.shipping_method.to_dict() if self.shipping_method else None
        }
    
    def __repr__(self):
        return f'<Quote {self.quote_number}>'
