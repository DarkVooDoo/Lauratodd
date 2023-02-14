--@block
CREATE TABLE Cookie(
    cookie_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cookie_name VARCHAR(50) NOT NULL,
    cookie_packaging INT NOT NULL,
    cookie_created DATE NOT NULL DEFAULT NOW(),
    cookie_amount INT NOT NULL,
    cookie_threshold INT NOT NULL,
    cookie_ratio REAL NOT NULL DEFAULT 1,
    cookie_ismachine BOOLEAN DEFAULT true;
    cookie_weight INT NOT NULL DEFAULT 50
);

--@block
SELECT cookie_id, cookie_name, category_family, cookie_amount, category_isendchain FROM Cookie LEFT JOIN Category ON category_cookie_id=cookie_id ORDER BY cookie_name ASC;

--@block
CREATE TYPE Category_enum AS ENUM ('Lait', 'Noir', 'Blanc');

--@block
CREATE TABLE Category (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_family Category_enum,
    category_isEndChain bool NOT NULL,
    category_cookie_id UUID NOT NULL,
    FOREIGN KEY(category_cookie_id) REFERENCES Cookie(cookie_id) ON DELETE CASCADE
);

--@block
SELECT * FROM category;

--@block
ALTER TABLE Category RENAME COLUMN category_type TO category_family;

--@block
UPDATE Category SET category_family='All' WHERE category_cookie_id='bda4995d-86cd-4b8e-b150-ad123b78e230';

--@block
INSERT INTO Category (category_type, category_isendchain, category_cookie_id) VALUES('None', true, 'bda4995d-86cd-4b8e-b150-ad123b78e230');

--@block
CREATE TYPE Room_enum AS ENUM ('Cuisson', 'Prod');

--@block
CREATE TABLE Room(
    room_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_name Room_enum NOT NULL
);

--@block
INSERT INTO Room (room_name) VALUES ('Moises');