from flask import Blueprint, request, jsonify
from app.models.shipment import Shipment

tracking_bp = Blueprint('tracking', __name__)

@tracking_bp.route('/<tracking_number>', methods=['GET'])
def get_tracking_info(tracking_number):
    try:
        shipment = Shipment.query.filter_by(tracking_number=tracking_number.upper()).first()
        if not shipment:
            return jsonify({'error': 'Tracking number not found'}), 404
        return jsonify({'shipment': shipment.to_dict(include_events=True)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tracking_bp.route('/search', methods=['POST'])
def search_tracking():
    try:
        data = request.get_json()
        if not data or 'tracking_number' not in data:
            return jsonify({'error': 'Tracking number is required'}), 400
        
        tracking_number = data['tracking_number'].strip().upper()
        shipment = Shipment.query.filter_by(tracking_number=tracking_number).first()
        
        if not shipment:
            return jsonify({'error': 'Tracking number not found'}), 404
        
        return jsonify({'shipment': shipment.to_dict(include_events=True)}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
