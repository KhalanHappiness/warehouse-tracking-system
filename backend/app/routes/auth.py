from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.utils.validators import validate_email_address, validate_password, validate_required_fields

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        valid, message = validate_required_fields(data, ['email', 'password', 'full_name'])
        if not valid:
            return jsonify({'error': message}), 400
        
        valid, email_or_error = validate_email_address(data['email'])
        if not valid:
            return jsonify({'error': email_or_error}), 400
        
        if User.query.filter_by(email=email_or_error).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        user = User(email=email_or_error, full_name=data['full_name'], phone=data.get('phone'))
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({'message': 'User registered successfully', 'user': user.to_dict(), 
                       'access_token': access_token, 'refresh_token': refresh_token}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data.get('email')).first()
        
        if not user or not user.check_password(data.get('password', '')):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({'message': 'Login successful', 'user': user.to_dict(),
                       'access_token': access_token, 'refresh_token': refresh_token}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user = User.query.get(get_jwt_identity())
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'user': user.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
