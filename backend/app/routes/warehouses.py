from flask import Blueprint, request, jsonify
from app.models.warehouse import Warehouse

warehouses_bp = Blueprint('warehouses', __name__)

@warehouses_bp.route('/', methods=['GET'])
def get_warehouses():
    try:
        country = request.args.get('country')
        shipping_type = request.args.get('shipping_type')
        
        query = Warehouse.query.filter_by(is_active=True)
        if country:
            query = query.filter_by(country=country)
        
        warehouses = query.all()
        if shipping_type:
            warehouses = [w for w in warehouses if shipping_type in w.get_shipping_types()]
        
        return jsonify({'warehouses': [w.to_dict() for w in warehouses]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
