-- todo create tables
-- todo fill api calls according to table
CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    image_metadata VARCHAR(100),
    image_blob BYTEA
);

CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
    balance DECIMAL,
    delivery_address VARCHAR(100) NOT NULL,
    FOREIGN KEY (id) REFERENCES profile(id),
    CHECK(balance >= 0) );

CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES profile(id)
);

CREATE TABLE business (
    id SERIAL PRIMARY KEY,
    income DECIMAL,
    verifying_admin INT,
    verification_date DATE,
    IBAN VARCHAR(30) NOT NULL,
    FOREIGN KEY (id) REFERENCES profile(id),
    FOREIGN KEY (verifying_admin) REFERENCES admin(id)
);

CREATE TABLE report (
    report_id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL,
    description TEXT,
    report_time TIMESTAMP,
    graph_data BYTEA NOT NULL,
    graph_metadata VARCHAR(150) NOT NULL,
    FOREIGN KEY (admin_id) REFERENCES admin(id)
);

CREATE TABLE giftcard (
    gift_id SERIAL PRIMARY KEY,
    cust_id INT NOT NULL,
    business_id INT NOT NULL,
    gift_amount DECIMAL NOT NULL,
    gift_message TEXT,
    creation_date DATE,
    redemption_date DATE,
    FOREIGN KEY (cust_id) REFERENCES customer(id),
    FOREIGN KEY (business_id) REFERENCES business(id),
    CHECK(gift_amount > 0)
);

 CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50)
);

CREATE TABLE handcraftedgood (
    b_id INT,
    p_id SERIAL,
    inventory INT NOT NULL,
    current_price DECIMAL NOT NULL,
    name VARCHAR(50),
    return_period INT NOT NULL,
    description VARCHAR(255),
    recipient_type VARCHAR(50),
    materials VARCHAR(50),
    FOREIGN KEY (b_id) REFERENCES business(id) ON DELETE CASCADE,
    PRIMARY KEY(p_id),
    CHECK( inventory >= 0 AND current_price > 0)
);

CREATE TABLE productphoto (
    p_id INT,
    b_id INT,
    photo_metadata VARCHAR(100),
    photo_blob BYTEA,
    PRIMARY KEY (p_id, photo_metadata),
    FOREIGN KEY (p_id) REFERENCES handcraftedgood(p_id)
);

CREATE TABLE belong (
    category_id INT,
    p_id INT,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE,
    FOREIGN KEY (p_id) REFERENCES handcraftedgood(p_id) ON DELETE CASCADE,
    PRIMARY KEY (category_id, p_id)
);
CREATE TABLE purchase (
    c_id INT,
    p_id INT,
    p_date TIMESTAMP NOT NULL,
    p_price DECIMAL NOT NULL,
    return_date TIMESTAMP NOT NULL,
    FOREIGN KEY (c_id) REFERENCES customer(id),
    FOREIGN KEY (p_id) REFERENCES handcraftedgood(p_id),
    PRIMARY KEY (c_id, p_id, p_date),
    CHECK(p_price > 0)
);

CREATE TABLE wishlist (
    c_id INT,
    p_id INT,
    FOREIGN KEY (c_id) REFERENCES customer(id) ON DELETE CASCADE,
    FOREIGN KEY (p_id) REFERENCES handcraftedgood(p_id) ON DELETE CASCADE,
    PRIMARY KEY (c_id, p_id)
);
CREATE TABLE shoppingcart (
    c_id INT,
    p_id INT,
    quantity INT NOT NULL,
    FOREIGN KEY (c_id) REFERENCES customer(id) ON DELETE CASCADE,
    FOREIGN KEY (p_id) REFERENCES handcraftedgood(p_id) ON DELETE CASCADE,
    PRIMARY KEY (c_id, p_id),
    CHECK(quantity > 0)
);

CREATE TABLE pastprice (
    p_id INT PRIMARY KEY,
    change_date DATE,
    price DECIMAL NOT NULL,
    FOREIGN KEY (p_id) REFERENCES handcraftedgood(p_id) ON DELETE CASCADE,
    CHECK(price > 0)
);
CREATE TABLE rates (
    c_id INT,
    p_id INT,
    rate_amount DECIMAL NOT NULL,
    comment TEXT,
    FOREIGN KEY (c_id) REFERENCES customer(id),
    FOREIGN KEY (p_id) REFERENCES handcraftedgood(p_id) ON DELETE CASCADE,
    PRIMARY KEY (c_id, p_id),
    CHECK(rate_amount <=5 and rate_amount >= 0)
);
CREATE VIEW customer_overview AS
SELECT p.id, p.name, p.email, c.balance, c.delivery_address
FROM profile p
JOIN customer c ON p.id = c.id;

CREATE VIEW business_verification_status AS
SELECT b.id, p.name, p.image_metadata, p.image_blob, b.verifying_admin, b.verification_date, a.id AS admin_id, ap.name AS admin_name
FROM business b
JOIN profile p ON b.id = p.id
JOIN admin a ON b.verifying_admin = a.id
JOIN profile ap ON a.id = ap.id;

CREATE VIEW product_ratings AS
SELECT h.name, r.rate_amount, r.comment
FROM rates r
JOIN handcraftedgood h ON r.p_id = h.p_id;

CREATE VIEW product_listings AS
SELECT h.name, h.current_price, h.inventory, c.category_name
FROM handcraftedgood h
JOIN belong b ON h.b_id = b.p_id
JOIN category c ON b.category_id = c.category_id;

CREATE VIEW admin_activity AS
SELECT a.id, p.name, r.report_id, r.description, r.report_time
FROM admin a
JOIN profile p ON a.id = p.id
JOIN report r ON a.id = r.admin_id;
