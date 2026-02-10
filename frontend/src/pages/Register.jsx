import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTruck, FiPackage } from 'react-icons/fi';
import quoteService from '../services/quoteService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const QuoteCalculator = () => {
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formData, setFormData] = useState({ actual_weight: '', volume_cbm: '' });
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadShippingMethods();
  }, []);

  const loadShippingMethods = async () => {
    try {
      const methods = await quoteService.getShippingMethods();
      setShippingMethods(methods);
    } catch (error) {
      console.error('Failed to load shipping methods:', error);
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!selectedMethod) return;

    setLoading(true);
    try {
      const quoteData = await quoteService.calculateQuote({
        shipping_method_id: selectedMethod.id,
        actual_weight: parseFloat(formData.actual_weight),
        volume_cbm: parseFloat(formData.volume_cbm),
      });
      setQuote(quoteData);
    } catch (error) {
      console.error('Failed to calculate quote:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-dark py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <FiDollarSign className="text-5xl text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Shipping Quote Calculator</h1>
          <p className="text-gray-400">Get instant shipping quotes for air and sea freight from China to Kenya</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {shippingMethods.map((method) => (
            <Card
              key={method.id}
              hover
              className={`cursor-pointer transition-all ${
                selectedMethod?.id === method.id ? 'ring-2 ring-primary border-primary' : ''
              }`}
              onClick={() => setSelectedMethod(method)}
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-lg ${method.type === 'air' ? 'bg-blue-500/10' : 'bg-green-500/10'} mr-4`}>
                  {method.type === 'air' ? <FiPackage className="text-2xl text-blue-400" /> : <FiTruck className="text-2xl text-green-400" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{method.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{method.transit_days}</p>
                  <p className="text-2xl font-bold text-primary">{method.currency} {method.base_rate}/{method.rate_type === 'per_kg' ? 'kg' : 'CBM'}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {selectedMethod && (
          <Card>
            <form onSubmit={handleCalculate} className="space-y-6">
              <h3 className="text-xl font-bold text-white">{selectedMethod.name}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Weight (kg)"
                  placeholder="2000"
                  value={formData.actual_weight}
                  onChange={(e) => setFormData({ ...formData, actual_weight: e.target.value })}
                  required
                />
                <Input
                  type="number"
                  label="Volume (CBM)"
                  placeholder="5"
                  step="0.001"
                  value={formData.volume_cbm}
                  onChange={(e) => setFormData({ ...formData, volume_cbm: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" loading={loading}>
                Calculate Quote
              </Button>
            </form>

            {quote && (
              <div className="mt-6 p-6 bg-navy rounded-lg">
                <div className="text-center mb-4">
                  <h4 className="text-sm text-gray-400 mb-2">Total Shipping Cost</h4>
                  <p className="text-4xl font-bold text-primary">{quote.currency} {quote.total_cost?.toLocaleString()}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm border-t border-navy-light pt-4">
                  <div>
                    <p className="text-gray-400">Actual Weight</p>
                    <p className="text-white">{quote.actual_weight} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Volume Weight</p>
                    <p className="text-white">{(quote.volume_cbm * 166).toFixed(2)} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Chargeable Weight</p>
                    <p className="text-primary font-bold">{quote.chargeable_weight} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Rate</p>
                    <p className="text-white">{quote.currency} {quote.rate}/kg</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuoteCalculator;
