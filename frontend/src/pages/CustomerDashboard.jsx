import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiPackage, FiFileText, FiTrendingUp, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import trackingService from '../services/trackingService';
import quoteService from '../services/quoteService';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalShipments: 0,
    inTransit: 0,
    delivered: 0,
    totalQuotes: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [shipmentsData, quotesData] = await Promise.all([
        trackingService.getMyShipments(),
        quoteService.getMyQuotes()
      ]);
      
      const shipmentsList = shipmentsData.shipments || [];
      const quotesList = quotesData.quotes || [];
      
      setShipments(shipmentsList);
      setQuotes(quotesList);
      
      // Calculate stats
      setStats({
        totalShipments: shipmentsList.length,
        inTransit: shipmentsList.filter(s => s.current_status === 'in_transit').length,
        delivered: shipmentsList.filter(s => s.current_status === 'delivered').length,
        totalQuotes: quotesList.length
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'delivered': 'bg-green-100 text-green-700',
      'in_transit': 'bg-primary/10 text-primary-dark',
      'pending': 'bg-gray-100 text-gray-700',
      'cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-text-secondary">Here's what's happening with your shipments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium">Total Shipments</p>
                <p className="text-3xl font-bold text-text mt-2">{stats.totalShipments}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <FiPackage className="text-2xl text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium">In Transit</p>
                <p className="text-3xl font-bold text-text mt-2">{stats.inTransit}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FiClock className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium">Delivered</p>
                <p className="text-3xl font-bold text-text mt-2">{stats.delivered}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FiTrendingUp className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium">Total Quotes</p>
                <p className="text-3xl font-bold text-text mt-2">{stats.totalQuotes}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <FiFileText className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Shipments */}
          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text">Recent Shipments</h2>
              <Link to="/tracking" className="text-primary hover:text-primary-dark text-sm font-medium">
                View All
              </Link>
            </div>
            
            {loading ? (
              <p className="text-text-muted">Loading...</p>
            ) : shipments.length > 0 ? (
              <div className="space-y-4">
                {shipments.slice(0, 5).map((shipment) => (
                  <div key={shipment.id} className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-text">{shipment.tracking_number}</p>
                      <p className="text-sm text-text-secondary mt-1">{shipment.description}</p>
                      <p className="text-xs text-text-muted mt-1">
                        {shipment.shipping_method?.name}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.current_status)}`}>
                      {shipment.current_status?.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiPackage className="text-5xl text-text-muted mx-auto mb-4" />
                <p className="text-text-muted">No shipments yet</p>
                <Link to="/quote" className="text-primary hover:text-primary-dark text-sm mt-2 inline-block">
                  Get a quote to start shipping
                </Link>
              </div>
            )}
          </div>

          {/* Recent Quotes */}
          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text">Recent Quotes</h2>
              <Link to="/quote" className="text-primary hover:text-primary-dark text-sm font-medium">
                View All
              </Link>
            </div>
            
            {loading ? (
              <p className="text-text-muted">Loading...</p>
            ) : quotes.length > 0 ? (
              <div className="space-y-4">
                {quotes.slice(0, 5).map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-text">{quote.quote_number}</p>
                      <p className="text-sm text-text-secondary mt-1">
                        {quote.shipping_method?.name}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {quote.chargeable_weight} kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        {quote.currency} {Number(quote.total_cost).toLocaleString()}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {new Date(quote.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiFileText className="text-5xl text-text-muted mx-auto mb-4" />
                <p className="text-text-muted">No quotes yet</p>
                <Link to="/quote" className="text-primary hover:text-primary-dark text-sm mt-2 inline-block">
                  Calculate your first quote
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
