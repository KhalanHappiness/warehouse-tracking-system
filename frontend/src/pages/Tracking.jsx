import React, { useState } from 'react';
import { FiSearch, FiPackage, FiClock, FiMapPin } from 'react-icons/fi';
import { format } from 'date-fns';
import trackingService from '../services/trackingService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');
    setShipment(null);

    try {
      const data = await trackingService.trackShipment(trackingNumber);
      setShipment(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Tracking number not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <FiPackage className="text-5xl text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Track Your Package</h1>
          <p className="text-gray-400">Enter your tracking number to get real-time updates on your shipment</p>
        </div>

        <Card className="mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <Input
              label="Tracking Number"
              placeholder="RD0013536"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
              icon={<FiSearch />}
              error={error}
            />
            <Button type="submit" className="w-full" loading={loading} icon={<FiSearch />}>
              Track Package
            </Button>
          </form>
          
          <div className="mt-4 p-4 bg-navy rounded-lg">
            <p className="text-sm text-gray-400">
              <strong className="text-primary">Tracking Information</strong><br />
              Enter your tracking number to get detailed information about your shipment's current status and location.
            </p>
          </div>
        </Card>

        {shipment && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-1">{shipment.tracking_number}</h2>
                  <p className="text-sm text-gray-400">
                    {shipment.shipping_method?.name} • {shipment.shipping_method?.type?.toUpperCase()}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  shipment.current_status === 'delivered' ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary'
                }`}>
                  {shipment.current_status.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-white">{shipment.description}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Consignment Number</p>
                  <p className="text-white">{shipment.consignment_number}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Cartons</p>
                  <p className="text-white">{shipment.cartons}</p>
                </div>
              </div>

              <div className="bg-navy rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Shipping Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Status</p>
                    <p className="text-primary font-medium">{shipment.current_status}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Actual Weight</p>
                    <p className="text-white">{shipment.actual_weight} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Volume</p>
                    <p className="text-white">{shipment.volume_cbm} CBM</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Chargeable Weight</p>
                    <p className="text-white">{shipment.chargeable_weight} kg</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <FiClock className="mr-2" />
                Tracking Status
              </h3>
              
              <div className="space-y-4">
                {shipment.tracking_events?.map((event, index) => (
                  <div key={event.id} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-4 h-4 rounded-full ${
                        event.is_current ? 'bg-primary ring-4 ring-primary/20' : 'bg-gray-600'
                      }`}></div>
                      {index < shipment.tracking_events.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-700 my-2"></div>
                      )}
                    </div>
                    
                    <div className={`flex-1 pb-6 ${event.is_current ? 'text-white' : 'text-gray-500'}`}>
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold">{event.event_type}</h4>
                        {event.is_current && (
                          <span className="text-xs bg-primary text-navy px-2 py-1 rounded-full font-medium">
                            Currently Processing
                          </span>
                        )}
                      </div>
                      <p className="text-sm flex items-center mb-1">
                        <FiMapPin className="mr-1" size={14} />
                        {event.location}
                      </p>
                      <p className="text-xs">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {!shipment && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Need help? Contact our support team at <a href="tel:+254768477860" className="text-primary">+254768477860</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
