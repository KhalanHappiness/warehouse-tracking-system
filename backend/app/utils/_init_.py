from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app(config_name='development'):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.tracking import tracking_bp
    from app.routes.quotes import quotes_bp
    from app.routes.warehouses import warehouses_bp
    from app.routes.admin import admin_bp
    from app.routes.shipping_methods import shipping_methods_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(tracking_bp, url_prefix='/api/tracking')
    app.register_blueprint(quotes_bp, url_prefix='/api/quotes')
    app.register_blueprint(warehouses_bp, url_prefix='/api/warehouses')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(shipping_methods_bp, url_prefix='/api/shipping-methods')
    
    # Health check route
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Golden Sail Logistics API is running'}, 200
    
    return app
