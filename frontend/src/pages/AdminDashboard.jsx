import React, { useState, useEffect } from 'react';
import { FiPackage, FiUsers, FiTrendingUp, FiDollarSign, FiEdit, FiEye, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalShipments: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0
  });
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [shippingMethods, setShippingMethods] = useState([]);
  
  // Form state for creating shipment
  const [newShipment, setNewShipment] = useState({
    description: '',
    cartons: '',
    actual_weight: '',
    volume_cbm: '',
    shipping_method_id: '',
    origin: '',
    destination: '',
    consignment_number: ''
  });

  useEffect(() => {
    loadData();
    loadShippingMethods();
  }, []);

  const loadShippingMethods = async () => {
    try {
      const response = await api.get('/shipping-methods/');
      setShippingMethods(response.data.shipping_methods || []);
    } catch (error) {
      console.error('Failed to load shipping methods:', error);
    }
  };

  const loadData = async () => {
    try {
      const response = await api.get('/admin/shipments');
      const shipmentsList = response.data.shipments || [];
      setShipments(shipmentsList);
      
      setStats({
        totalShipments: shipmentsList.length,
        inTransit: shipmentsList.filter(s => s.current_status === 'in_transit').length,
        delivered: shipmentsList.filter(s => s.current_status === 'delivered').length,
        pending: shipmentsList.filter(s => s.current_status === 'pending').length
      });
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/shipments', newShipment);
      alert('Shipment created successfully!');
      setShowCreateModal(false);
      setNewShipment({
        description: '',
        cartons: '',
        actual_weight: '',
        volume_cbm: '',
        shipping_method_id: '',
        origin: '',
        destination: '',
        consignment_number: ''
      });
      loadData();
    } catch (error) {
      console.error('Failed to create shipment:', error);
      alert('Failed to create shipment: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUpdateStatus = async (shipmentId, newStatus) => {
    try {
      await api.put(`/admin/shipments/${shipmentId}/status`, {
        status: newStatus,
        event_type: `Status updated to ${newStatus}`,
        location: 'Admin Update',
        description: `Status changed to ${newStatus}`,
        is_current: true
      });
      loadData();
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update shipment status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'delivered': 'bg-green-100 text-green-700',
      'in_transit': 'bg-blue-100 text-blue-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Create Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Admin Dashboard</h1>
            <p className="text-text-secondary">Manage all shipments and track performance</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <FiPlus className="text-xl" />
            <span>Create Shipment</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium">Total Shipments</p>
                <p className="text-3xl font-bold text-text mt-2">{stats.totalShipments}</p>
                <p className="text-xs text-green-600 mt-2">↑ All time</p>
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
                <p className="text-xs text-blue-600 mt-2">→ Active</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FiTrendingUp className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium">Delivered</p>
                <p className="text-3xl font-bold text-text mt-2">{stats.delivered}</p>
                <p className="text-xs text-green-600 mt-2">✓ Completed</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FiUsers className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-text mt-2">{stats.pending}</p>
                <p className="text-xs text-yellow-600 mt-2">⏳ Awaiting</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <FiDollarSign className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-text">All Shipments</h2>
            <p className="text-sm text-text-secondary mt-1">Manage and track all shipments</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Tracking Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-text-muted">
                      Loading shipments...
                    </td>
                  </tr>
                ) : shipments.length > 0 ? (
                  shipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-background-secondary transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-text">{shipment.tracking_number}</div>
                        <div className="text-xs text-text-muted">{shipment.consignment_number}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-text max-w-xs truncate">{shipment.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-secondary">{shipment.shipping_method?.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.current_status)}`}>
                          {shipment.current_status?.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {shipment.actual_weight} kg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-3">
                          <Link 
                            to={`/tracking`}
                            className="text-primary hover:text-primary-dark"
                            title="View Details"
                          >
                            <FiEye className="text-lg" />
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedShipment(shipment);
                              setShowUpdateModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="Update Status"
                          >
                            <FiEdit className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <FiPackage className="text-5xl text-text-muted mx-auto mb-4" />
                      <p className="text-text-muted mb-4">No shipments found</p>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="text-primary hover:text-primary-dark font-medium"
                      >
                        Create your first shipment
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Shipment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8 p-6">
              <h3 className="text-2xl font-bold text-text mb-6">Create New Shipment</h3>
              
              <form onSubmit={handleCreateShipment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Description *</label>
                    <input
                      type="text"
                      required
                      value={newShipment.description}
                      onChange={(e) => setNewShipment({...newShipment, description: e.target.value})}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Electronics, Toys, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Consignment Number</label>
                    <input
                      type="text"
                      value={newShipment.consignment_number}
                      onChange={(e) => setNewShipment({...newShipment, consignment_number: e.target.value})}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., sea_186"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Number of Cartons *</label>
                    <input
                      type="number"
                      required
                      value={newShipment.cartons}
                      onChange={(e) => setNewShipment({...newShipment, cartons: e.target.value})}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 24"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Actual Weight (kg) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newShipment.actual_weight}
                      onChange={(e) => setNewShipment({...newShipment, actual_weight: e.target.value})}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 2000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Volume (CBM) *</label>
                    <input
                      type="number"
                      step="0.001"
                      required
                      value={newShipment.volume_cbm}
                      onChange={(e) => setNewShipment({...newShipment, volume_cbm: e.target.value})}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Shipping Method *</label>
                    <select
                      required
                      value={newShipment.shipping_method_id}
                      onChange={(e) => setNewShipment({...newShipment, shipping_method_id: e.target.value})}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select method...</option>
                      {shippingMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.name} - {method.currency} {method.base_rate}/{method.rate_type === 'per_kg' ? 'kg' : 'CBM'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Origin *</label>
                    <input
                      type="text"
                      required
                      value={newShipment.origin}
                      onChange={(e) => setNewShipment({...newShipment, origin: e.target.value})}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Guangdong, China"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Destination *</label>
                    <input
                      type="text"
                      required
                      value={newShipment.destination}
                      onChange={(e) => setNewShipment({...newShipment, destination: e.target.value})}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Mombasa, Kenya"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-background-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                  >
                    Create Shipment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showUpdateModal && selectedShipment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <h3 className="text-xl font-bold text-text mb-4">Update Shipment Status</h3>
              <p className="text-sm text-text-secondary mb-4">
                Tracking: <span className="font-semibold">{selectedShipment.tracking_number}</span>
              </p>
              
              <div className="space-y-3 mb-6">
                {['pending', 'in_transit', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(selectedShipment.id, status)}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left font-medium
                      ${selectedShipment.current_status === status 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-border hover:border-primary-light'
                      }`}
                  >
                    {status.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-background-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;