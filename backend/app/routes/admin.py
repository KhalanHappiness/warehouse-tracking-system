from flask import Blueprint, request, jsonify
from app import db
from app.models.shipment import Shipment
from app.models.tracking_event import TrackingEvent
from app.middleware.auth import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/shipments', methods=['GET'])
@admin_required
def get_all_shipments(current_user):
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        pagination = Shipment.query.order_by(Shipment.created_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        shipments = [s.to_dict(include_events=False) for s in pagination.items]
        
        return jsonify({
            'shipments': shipments,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/shipments/<int:shipment_id>/status', methods=['PUT'])
@admin_required
def update_shipment_status(current_user, shipment_id):
    try:
        data = request.get_json()
        shipment = Shipment.query.get(shipment_id)
        
        if not shipment:
            return jsonify({'error': 'Shipment not found'}), 404
        
        if 'status' in data:
            shipment.current_status = data['status']
        
        # Add tracking event
        if 'event_type' in data:
            event = TrackingEvent(
                shipment_id=shipment.id,
                event_type=data['event_type'],
                location=data.get('location'),
                description=data.get('description'),
                is_current=data.get('is_current', False)
            )
            db.session.add(event)
        
        db.session.commit()
        return jsonify({'message': 'Shipment updated successfully', 'shipment': shipment.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
