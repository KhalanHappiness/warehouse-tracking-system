from flask import Blueprint, jsonify
from app.models.shipping_method import ShippingMethod

shipping_methods_bp = Blueprint('shipping_methods', __name__)

@shipping_methods_bp.route('/', methods=['GET'])
def get_shipping_methods():
    try:
        methods = ShippingMethod.query.filter_by(is_active=True).all()
        return jsonify([m.to_dict() for m in methods]), 200  # Return array directly
    except Exception as e:
        return jsonify({'error': str(e)}), 500