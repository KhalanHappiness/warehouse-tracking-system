#!/usr/bin/env python
"""
Database seed script
Populates database with initial data for testing
"""
from app import create_app, db
from app.models import User, ShippingMethod, Warehouse, Shipment, TrackingEvent
from datetime import datetime, timedelta

def seed_database():
    """Seed the database with initial data"""
    
    app = create_app()
    
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        
        print("Creating all tables...")
        db.create_all()
        
        # Create Admin User
        print("Creating admin user...")
        admin = User(
            email='admin@goldensail.com',
            full_name='Admin User',
            phone='+254700000000',
            role='admin',
            is_active=True
        )
        admin.set_password('admin123')
        db.session.add(admin)
        
        # Create Test Customer
        print("Creating test customer...")
        customer = User(
            email='customer@test.com',
            full_name='Test Customer',
            phone='+254711111111',
            role='customer',
            is_active=True
        )
        customer.set_password('customer123')
        db.session.add(customer)
        
        # Create Shipping Methods
        print("Creating shipping methods...")
        shipping_methods = [
            ShippingMethod(
                name='Direct Air (Guangzhou)',
                type='air',
                origin='Guangzhou',
                rate_type='per_kg',
                base_rate=12.50,
                currency='USD',
                transit_days_min=3,
                transit_days_max=5,
                schedule='Daily departures',
                restrictions='All items accepted',
                is_active=True
            ),
            ShippingMethod(
                name='Hong Kong Air',
                type='air',
                origin='Hong Kong',
                rate_type='per_kg',
                base_rate=14.00,
                currency='USD',
                transit_days_min=10,
                transit_days_max=15,
                schedule='Weekly departures',
                restrictions='Including batteries, liquids, powders, food',
                is_active=True
            ),
            ShippingMethod(
                name='Guangzhou Sea Freight',
                type='sea',
                origin='Guangzhou',
                rate_type='per_cbm',
                base_rate=60000,
                currency='KSH',
                transit_days_min=30,
                transit_days_max=35,
                schedule='Weekly departures',
                restrictions='All items accepted',
                is_active=True
            ),
            ShippingMethod(
                name='Yiwu Sea Freight',
                type='sea',
                origin='Yiwu',
                rate_type='per_cbm',
                base_rate=55000,
                currency='KSH',
                transit_days_min=30,
                transit_days_max=35,
                schedule='Weekly departures',
                restrictions='All items accepted',
                is_active=True
            )
        ]
        
        for method in shipping_methods:
            db.session.add(method)
        
        db.session.commit()  # Commit to get IDs
        
        # Create Warehouses
        print("Creating warehouses...")
        warehouses = [
            Warehouse(
                name='Direct Air (Guangzhou)',
                type='warehouse',
                country='China',
                address_en='GUANGZHOU AIR WAREHOUSE, NO. 20-3, XIATANG WEST ROAD, YUEXIU DISTRICT, GUANGZHOU, CHINA',
                address_cn='广州空运仓库, 中国广州市越秀区下塘西路20-3号',
                phone_1='17382634669',
                phone_2='13726888283',
                shipping_method_types='air',
                is_active=True
            ),
            Warehouse(
                name='Hong Kong Air',
                type='warehouse',
                country='China',
                address_en='HONG KONG AIR WAREHOUSE, KWAI CHUNG, NEW TERRITORIES, HONG KONG',
                address_cn='香港空运仓库, 香港新界葵涌',
                phone_1='17382634669',
                shipping_method_types='air',
                is_active=True
            ),
            Warehouse(
                name='Guangzhou Sea Freight',
                type='warehouse',
                country='China',
                address_en='GUANGZHOU SEA WAREHOUSE, HUANGPU PORT, GUANGZHOU, CHINA',
                address_cn='广州海运仓库, 中国广州黄埔港',
                phone_1='17382634669',
                shipping_method_types='sea',
                is_active=True
            ),
            Warehouse(
                name='Yiwu Sea Freight',
                type='warehouse',
                country='China',
                address_en='YIWU SEA WAREHOUSE, YIWU INTERNATIONAL TRADE CITY, ZHEJIANG, CHINA',
                address_cn='义乌海运仓库, 中国浙江义乌国际商贸城',
                phone_1='17382634669',
                shipping_method_types='sea',
                is_active=True
            ),
            Warehouse(
                name='Main Warehouse',
                type='warehouse',
                country='Kenya',
                address_en='GOLDEN SAIL MAIN WAREHOUSE, INDUSTRIAL AREA, NAIROBI, KENYA',
                phone_1='+254702103111',
                email='info.goldensaillogistics@gmail.com',
                shipping_method_types='air,sea',
                is_active=True
            ),
            Warehouse(
                name='Eastleigh Office',
                type='office',
                country='Kenya',
                address_en='GOLDEN SAIL EASTLEIGH OFFICE, 1ST AVENUE, EASTLEIGH, NAIROBI, KENYA',
                phone_1='+254702103111',
                email='info.goldensaillogistics@gmail.com',
                shipping_method_types='air,sea',
                is_active=True
            ),
            Warehouse(
                name='CBD Pick-up Point',
                type='pickup_point',
                country='Kenya',
                address_en='GOLDEN SAIL CBD OFFICE, KIMATHI STREET, NAIROBI CBD, KENYA',
                phone_1='+254702103111',
                email='info.goldensaillogistics@gmail.com',
                shipping_method_types='air,sea',
                is_active=True
            )
        ]
        
        for warehouse in warehouses:
            db.session.add(warehouse)
        
        # Create Sample Shipment
        print("Creating sample shipment...")
        shipment = Shipment(
            tracking_number='RD00135536',
            user_id=customer.id,
            shipping_method_id=shipping_methods[1].id,  # Hong Kong Air
            consignment_number='sea_186',
            description='Toy desks and electric bikes 玩具桌 电动车',
            cartons=24,
            actual_weight=2000,
            volume_cbm=5.0,
            rate=14.00,
            currency='USD',
            current_status='in_transit',
            origin='Guangdong, China',
            destination='Mombasa, Kenya',
            estimated_delivery=(datetime.utcnow() + timedelta(days=7)).date()
        )
        shipment.calculate_chargeable_weight()
        shipment.calculate_total_cost()
        db.session.add(shipment)
        db.session.commit()
        
        # Create Tracking Events
        print("Creating tracking events...")
        tracking_events = [
            TrackingEvent(
                shipment_id=shipment.id,
                event_type='Port of Loading Guangdong, China',
                location='Loading at Guangdong Port',
                description='Currently Processing',
                is_current=True,
                event_time=datetime.utcnow()
            ),
            TrackingEvent(
                shipment_id=shipment.id,
                event_type='Customs Export Clearance China',
                location='Export customs processing in China',
                description='Pending',
                is_current=False,
                event_time=datetime.utcnow() - timedelta(hours=12)
            ),
            TrackingEvent(
                shipment_id=shipment.id,
                event_type='Transshipment Port',
                location='Transshipment hub processing',
                description='Pending',
                is_current=False,
                event_time=datetime.utcnow() - timedelta(hours=24)
            ),
            TrackingEvent(
                shipment_id=shipment.id,
                event_type='Port of Discharge Mombasa, Kenya',
                location='Discharge at Mombasa Port',
                description='Pending',
                is_current=False,
                event_time=datetime.utcnow() - timedelta(hours=36)
            ),
            TrackingEvent(
                shipment_id=shipment.id,
                event_type='Inland Delivery to Warehouse',
                location='Transportation to final warehouse',
                description='Pending',
                is_current=False,
                event_time=datetime.utcnow() - timedelta(hours=48)
            ),
            TrackingEvent(
                shipment_id=shipment.id,
                event_type='Arrived Successfully',
                location='Package delivered and available for pickup',
                description='Pending',
                is_current=False,
                event_time=datetime.utcnow() - timedelta(hours=60)
            )
        ]
        
        for event in tracking_events:
            db.session.add(event)
        
        db.session.commit()
        
        print("\n✅ Database seeded successfully!")
        print("\n📝 Test Accounts:")
        print("   Admin: admin@goldensail.com / admin123")
        print("   Customer: customer@test.com / customer123")
        print("\n📦 Sample Tracking Number: RD00135536")

if __name__ == '__main__':
    seed_database()
