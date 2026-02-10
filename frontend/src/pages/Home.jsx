import React from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiEye, FiDollarSign, FiMapPin, FiArrowRight } from 'react-icons/fi';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Home = () => {
  const services = [
    {
      icon: <FiPackage className="text-4xl text-blue-400" />,
      title: 'Package Tracking',
      description: 'Track shipments in real-time with status updates',
      link: '/tracking',
      buttonText: 'Track Package',
      color: 'blue',
    },
    {
      icon: <FiEye className="text-4xl text-yellow-500" />,
      title: 'Customer Portal',
      description: 'Track your packages and shipments',
      link: '/dashboard',
      buttonText: 'Customer Portal',
      color: 'yellow',
    },
    {
      icon: <FiDollarSign className="text-4xl text-green-400" />,
      title: 'Quote Calculator',
      description: 'Get instant shipping quotes for your cargo',
      link: '/quote',
      buttonText: 'Calculate Quote',
      color: 'green',
    },
    {
      icon: <FiMapPin className="text-4xl text-purple-400" />,
      title: 'Warehouse Locations',
      description: 'Find our warehouses in China and Kenya',
      link: '/warehouses',
      buttonText: 'View Locations',
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-navy-dark">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-block mb-8">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary/50">
                <span className="text-navy font-bold text-4xl">GS</span>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Global Logistics Solutions
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Affordable shipping from China to Kenya with full visibility and reliable delivery
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tracking">
                <Button size="lg" icon={<FiPackage />}>
                  Track Your Package
                </Button>
              </Link>
              <Link to="/quote">
                <Button size="lg" variant="outline">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              hover
              className="group"
            >
              <div className="text-center">
                <div className={`inline-flex p-4 rounded-full bg-${service.color}-500/10 mb-4 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2">
                  {service.title}
                </h3>
                
                <p className="text-gray-400 mb-6 min-h-[48px]">
                  {service.description}
                </p>
                
                <Link to={service.link}>
                  <Button variant="primary" className="w-full group-hover:bg-primary-dark">
                    {service.buttonText}
                    <FiArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Logistics Tracker?</h2>
            <p className="text-gray-300">Your trusted partner for China-Kenya logistics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Reliable Service',
                description: 'On-time delivery with full cargo insurance',
                icon: '✓',
              },
              {
                title: 'Competitive Rates',
                description: 'Best prices for air and sea freight',
                icon: '$',
              },
              {
                title: 'Real-time Tracking',
                description: 'Track your shipment every step of the way',
                icon: '📍',
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-navy-dark border-t border-navy py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Logistics Tracker Logistics. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-primary text-sm">Terms</a>
              <a href="#" className="text-gray-400 hover:text-primary text-sm">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-primary text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
