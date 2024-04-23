import React, { useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Nav } from 'react-bootstrap';
const CategoryPopularityChart = ({labels,valueList}) => {
  const data = {
    labels: ['Electronics', 'Books', 'Clothing', 'Home Appliances', 'Toys'],
    datasets: [
      {
        label: 'Category Popularity',
        data: [120, 150, 90, 70, 40], // Mock popularity data
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#E7E9ED',
          '#4BC0C0',
        ],
        hoverOffset: 4,
      },
    ],
  };

  return <Pie data={data} />;
};

const BusinessSalesChart = ({labels,valueList}) => {
  const data = {
    labels: ['Business A', 'Business B', 'Business C'],
    datasets: [
      {
        label: 'Sales',
        data: [300, 250, 400], // Mock sales data
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};
const Dashboard = () => {
const [activeTab,setActiveTab] = useState("category_chart");
const chartStyle = {
    width: '500px', // or whatever width you prefer
    // height: '50%', // or whatever height you prefer
    margin: 'auto' // this centers the chart in the div
  };
  return (
    <div>
        <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
            <Nav.Item>
                <Nav.Link eventKey="category_chart">Popular Categories</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="business_chart">Bussinesses Successful</Nav.Link>
            </Nav.Item>
        </Nav>
      {activeTab == "category_chart"?<div style={chartStyle}>
        <h2>Category Popularity</h2>
        <CategoryPopularityChart />
      </div>:<div style={chartStyle}>
        <h2>Business Sales</h2>
        <BusinessSalesChart />
      </div>}
    </div>
  );
};

export default Dashboard;
