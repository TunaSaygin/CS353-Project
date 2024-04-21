import React, { useState } from 'react'

export default function AdminPage() {
    // State to keep track of the active tab
  const [activeTab, setActiveTab] = useState('customers');
  // Placeholder data, you would fetch this from your backend
  const userData = [
    { name: 'Tuna Saygın', action: 'Purchased', business: 'Beymen', product: 'Pantalon', date: '24/3/2024' },
    { name: 'Sila Özel', action: 'Purchased', business: 'Bershka', product: 'Etek', date: '23/3/2024' },
    // ... more user data
  ];
  const businessData = [
    { name: 'Beymen', totalIncome: '150.032,01 TL', mostSoldProduct: 'Pantalon' },
    { name: 'Bershka', totalIncome: '148.023,62 TL', mostSoldProduct: 'Etek' },
    // ... more business data
  ];
    return (
        <div>
          <h1>Admin Dashboard</h1>
          <div>
            <button onClick={() => setActiveTab('customers')}>Customers</button>
            <button onClick={() => setActiveTab('businesses')}>Businesses</button>
            <button onClick={() => setActiveTab('actions')}>Actions</button>
            {/* ... other tabs ... */}
          </div>
          
          {/* Conditional rendering based on activeTab */}
          {activeTab === 'businesses' && (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Business Names</th>
                    <th>Total Income</th>
                    <th>Most Sold Product</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businessData.map((business, index) => (
                    <tr key={index}>
                      <td>{business.name}</td>
                      <td>{business.totalIncome}</td>
                      <td>{business.mostSoldProduct}</td>
                      <td>
                        <button>Verify</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
    
          {/* You can add similar conditional blocks for other tabs such as 'customers', 'actions', etc. */}
          
        </div>
      );
    };    
