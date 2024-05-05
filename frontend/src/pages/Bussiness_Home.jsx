import React from 'react'
import image from '../../DB_html/assets/img/dogs/image3.jpeg';
import img2 from '../../DB_html/assets/img/dogs/image2.jpeg';

export default function BusinessHome() {
  return (
    <div>
      <BusinessProfile compName="Sila's Mini Business" email='sila@minibusiness.com'></BusinessProfile>
      <ProductList products={[{ id: 1, name: 'Hat', price: '100₺', company: 'MyComp' }, { id: 2, name: 'Piercing', price: '1000₺', company: 'MyComp' }, { id: 3, name: 'Sweater', price: '203₺', company: 'MyComp' }, { id: 4, name: 'Sweater', price: '203₺', company: 'MyComp' }]}></ProductList>
    </div>
  );
}

function BusinessProfile(props) {
  const { compName, email } = props;
  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className='col-md-6'>
          <div className='card'>
            <div className='row-md-3 justify-content-center d-flex'>
              <div className='col-sm-5'>
                <img src={img2} className='img-fluid' style={{ borderRadius: '50%' }}></img>
              </div>
              <div className='col-sm-5'>
                <h4>{compName}</h4>
                <h6>{email}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductList(props) {
  const { products } = props;
  console.log(products);
  const productItems = products.map(product => (
    <div key={product.id} className="col-md-4 mb-2 justify-items-center">
      <div className="card">
        <div className="row-md-6">
          <div>
            <img src={image} className="img-fluid rounded-start rounded-end" alt="product" />
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="card-price">{product.price}</h4>
                </div>
                <div className="d-flex flex-column">
                  <button className="btn btn-outline-primary mb-2  btn-sm" type="button">Update</button>
                  <button className="btn btn-outline-primary btn-sm" type="button">Delete</button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        {productItems}
      </div>
    </div>
  );
}
