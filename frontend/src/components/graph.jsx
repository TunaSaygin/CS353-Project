import React, { useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Nav } from 'react-bootstrap';
import chroma from 'chroma-js';

const generateColors = (size) => {
  // Generate 'size' number of colors using chroma-js
  const scale = chroma.scale(['#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED', '#4BC0C0']).mode('lch').colors(size);
  return scale;
};
const CategoryPopularityChart = ({labels,valueList}) => {
  const backgroundColor = generateColors(labels.length);
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Category Popularity',
        data: valueList,
        backgroundColor: backgroundColor,
        hoverOffset: 4,
      },
    ],
  };

  return <Pie data={data} />;
};

const BusinessSalesChart = ({labels,valueList}) => {
  const backgroundColor = generateColors(labels.length);
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Sales',
        data: valueList, // Mock sales data
        backgroundColor:  backgroundColor.map(color => chroma(color).alpha(0.2).css()),
        borderColor: backgroundColor,
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
const Dashboard = ({categoryData,businessData}) => {
  console.log("categoryData:",categoryData)
  const categoryLabels = categoryData.map(category => category.category_name);
  const categoryValues = categoryData.map(category => category.total_price);

  const businessLabels = businessData.map(business => business.name);
  const businessValues = businessData.map(business => business.total_price);
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
        <CategoryPopularityChart labels={categoryLabels} valueList={categoryValues}/>
      </div>:<div style={chartStyle}>
        <h2>Business Sales</h2>
        <BusinessSalesChart labels={businessLabels} valueList={businessValues}/>
      </div>}
    </div>
  );
};

export default Dashboard;
