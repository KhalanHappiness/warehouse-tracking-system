from flask import Blueprint, request, jsonify
from app import db
from app.models.quote import Quote
from app.models.shipping_method import ShippingMethod
import traceback

quotes_bp = Blueprint('quotes', __name__)

@quotes_bp.route('/calculate', methods=['POST'])
def calculate_quote():
    try:
        print("=== Quote Calculation Started ===")
        data = request.get_json()
        print(f"Request data: {data}")
        
        # Validate required fields
        if not data or 'shipping_method_id' not in data:
            print("Error: Missing shipping_method_id")
            return jsonify({'error': 'Shipping method is required'}), 400
        
        # Get shipping method
        shipping_method = ShippingMethod.query.get(data['shipping_method_id'])
        print(f"Shipping method: {shipping_method}")
        
        if not shipping_method:
            print("Error: Shipping method not found")
            return jsonify({'error': 'Invalid shipping method'}), 404
        
        print(f"Shipping method found: {shipping_method.name}")
        
        # Create quote
        actual_weight = float(data.get('actual_weight', 0)) if data.get('actual_weight') else None
        volume_cbm = float(data.get('volume_cbm', 0)) if data.get('volume_cbm') else None
        
        print(f"Weight: {actual_weight}, Volume: {volume_cbm}")
        
        quote = Quote(
            shipping_method_id=shipping_method.id,
            actual_weight=actual_weight,
            volume_cbm=volume_cbm,
            rate=shipping_method.base_rate,
            currency=shipping_method.currency
        )
        
        print("Quote object created")
        
        # Calculate chargeable weight
        quote.calculate_chargeable_weight()
        print(f"Chargeable weight: {quote.chargeable_weight}")
        
        # Calculate total cost
        quote.calculate_total_cost()
        print(f"Total cost: {quote.total_cost}")
        
        # Return quote data
        quote_data = {
            'shipping_method': shipping_method.to_dict(),
            'actual_weight': float(quote.actual_weight) if quote.actual_weight else None,
            'volume_cbm': float(quote.volume_cbm) if quote.volume_cbm else None,
            'chargeable_weight': float(quote.chargeable_weight) if quote.chargeable_weight else None,
            'rate': float(quote.rate) if quote.rate else None,
            'total_cost': float(quote.total_cost) if quote.total_cost else None,
            'currency': quote.currency
        }
        
        print(f"Quote data: {quote_data}")
        print("=== Quote Calculation Success ===")
        
        return jsonify(quote_data), 200  # CHANGED THIS LINE
        
    except Exception as e:
        print(f"=== ERROR in calculate_quote ===")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print(f"Traceback:")
        traceback.print_exc()
        print("=== END ERROR ===")
        
        return jsonify({'error': str(e)}), 500