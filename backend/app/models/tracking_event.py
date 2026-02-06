from app import db
from datetime import datetime


class TrackingEvent(db.Model):
    __tablename__ = 'tracking_events'
    
    id = db.Column(db.Integer, primary_key=True)
    shipment_id = db.Column(db.Integer, db.ForeignKey('shipments.id', ondelete='CASCADE'), nullable=False)
    event_type = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(255))
    description = db.Column(db.Text)
    is_current = db.Column(db.Boolean, default=False)
    event_time = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert tracking event to dictionary"""
        return {
            'id': self.id,
            'event_type': self.event_type,
            'location': self.location,
            'description': self.description,
            'is_current': self.is_current,
            'event_time': self.event_time.isoformat() if self.event_time else None
        }
    
    def __repr__(self):
        return f'<TrackingEvent {self.event_type} - {self.location}>'
