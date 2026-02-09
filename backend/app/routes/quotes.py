from flask import Blueprint, request, jsonify
from app import db
from app.models.quote import Quote
from app.models.shipping_method import ShippingMethod

quotes_bp = Blueprint('quotes', __name__)

@quotes_bp.route('/calculate', methods=['POST'])
def calculate_quote():
    try:
        data = request.get_json()
        if not data or 'shipping_method_id' not in data:
            return jsonify({'error': 'Shipping method is required'}), 400
        
        shipping_method = ShippingMethod.query.get(data['shipping_method_id'])
        if not shipping_method:
            return jsonify({'error': 'Invalid shipping method'}), 404
        
        quote = Quote(
            shipping_method_id=shipping_method.id,
            actual_weight=data.get('actual_weight'),
            volume_cbm=data.get('volume_cbm'),
            rate=shipping_method.base_rate,
            currency=shipping_method.currency
        )
        
        quote.calculate_chargeable_weight()
        quote.calculate_total_cost()
        
        return jsonify({'quote': quote.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
