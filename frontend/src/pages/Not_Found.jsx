import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>404</h1>
      <p style={styles.subtext}>Oops! We can't seem to find the page you're looking for.</p>
      <Link to="/" style={styles.homeLink}>Go back home</Link>
    </div>
  );
};

// Styles
const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
  },
  header: {
    fontSize: '72px',
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: '24px',
  },
  homeLink: {
    display: 'inline-block',
    marginTop: '20px',
    fontSize: '18px',
    padding: '10px 20px',
    color: '#fff',
    backgroundColor: '#007bff',
    borderRadius: '5px',
    textDecoration: 'none',
  }
};

export default NotFoundPage;