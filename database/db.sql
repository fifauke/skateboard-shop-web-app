SET check_function_bodies = false;

CREATE SEQUENCE addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1;

CREATE TABLE "addresses"(
  "id" integer NOT NULL DEFAULT nextval('addresses_id_seq'),
  "country" varchar(50) NOT NULL,
  "city" varchar(30) NOT NULL,
  "street" varchar(30) NOT NULL,
  "building_number" varchar(5) NOT NULL,
  "apartment_number" varchar(4),
  "postal_code" varchar(6) NOT NULL,
  CONSTRAINT "addresses_pkey" PRIMARY KEY(id)
);

CREATE SEQUENCE employees_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1;

CREATE TABLE "employees"(
  "id" integer NOT NULL DEFAULT nextval('employees_id_seq'),
  "gender" varchar(1) NOT NULL,
  "birth_date" date NOT NULL,
  "pesel" char(11),
  "hire_date" date NOT NULL,
  "bank_account_number" char(26) NOT NULL,
  "stores_id" integer NOT NULL,
  "users_id" integer NOT NULL,
  CONSTRAINT "employees_pkey" PRIMARY KEY(id)
);

CREATE TABLE "manufacturers"(
  "id" integer NOT NULL,
  "name" varchar(30) NOT NULL,
  CONSTRAINT "manufacturers_pkey" PRIMARY KEY(id)
);

CREATE SEQUENCE orders_details_id_seq START WITH 1 INCREMENT BY 1 MINVALUE 1 NO MAXVALUE CACHE 1;

CREATE TABLE "order_details"(
  "id" integer NOT NULL DEFAULT nextval('orders_details_id_seq'),
  "orders_id" integer NOT NULL,
  "products_id" integer NOT NULL,
  "quantity" integer NOT NULL,
  "fixed_price" NUMERIC(10, 2) NOT NULL,
  CONSTRAINT "order_details_pkey" PRIMARY KEY(id)
);

CREATE SEQUENCE orders_id_seq START WITH 1 INCREMENT BY 1 MINVALUE 1 NO MAXVALUE CACHE 1;

CREATE TABLE "orders"(
  "id" integer NOT NULL DEFAULT nextval('orders_id_seq'),
  "price" NUMERIC(10, 2) NOT NULL,
  "order_date" date NOT NULL,
  "order_status" varchar(20) NOT NULL,
  "users_id" integer NOT NULL,
  "delivery_method" varchar(50),
  "payment_method" varchar(50),
  "shipping_cost" NUMERIC(10, 2),
  "total_amount" NUMERIC(10, 2),
  CONSTRAINT "orders_pkey" PRIMARY KEY(id)
);

CREATE SEQUENCE products_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1;

CREATE TABLE "products"(
  "id" integer NOT NULL DEFAULT nextval('products_id_seq'),
  "name" varchar(100) NOT NULL,
  "description" text NOT NULL,
  "price" NUMERIC(10, 2) NOT NULL,
  "size" varchar(50) NOT NULL,
  "material" varchar(50) NOT NULL,
  "tracks" varchar(50) NOT NULL,
  "concave" varchar(50) NOT NULL,
  "wheels" varchar(50) NOT NULL,
  "bearings" varchar(50) NOT NULL,
  "instock" integer NOT NULL,
  "stores_id" integer NOT NULL,
  "manufacturers_id" integer NOT NULL,
  CONSTRAINT "products_pkey" PRIMARY KEY(id)
);

CREATE SEQUENCE photos_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1;

CREATE TABLE "photos"(
  "id" integer NOT NULL DEFAULT nextval('photos_id_seq'),
  "path" varchar(255) NOT NULL,
  "products_id" integer NOT NULL,
  CONSTRAINT "photos_pkey" PRIMARY KEY(id)
);

CREATE TABLE "stores"(
  "id" integer NOT NULL,
  "name" varchar(30) NOT NULL,
  "email_address" varchar(30) NOT NULL,
  "phone_number" varchar(15) NOT NULL,
  "addresses_id" integer NOT NULL,
  CONSTRAINT "stores_pkey" PRIMARY KEY(id)
);

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1;

CREATE TABLE "users"(
  "id" integer NOT NULL DEFAULT nextval('users_id_seq'),
  "username" varchar(30) NOT NULL,
  "password" varchar(500) NOT NULL,
  "email_address" varchar(30) NOT NULL,
  "phone_number" varchar(15) NOT NULL,
  "name" varchar(30) NOT NULL,
  "last_name" varchar(50) NOT NULL,
  "second_name" varchar(50),
  "creation_date" date NOT NULL,
  "is_staff" BOOLEAN NOT NULL DEFAULT FALSE,
  "addresses_id" integer NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY(id)
);

CREATE SEQUENCE carts_id_seq 
    START WITH 1 
    INCREMENT BY 1 
    MINVALUE 1 
    NO MAXVALUE 
    CACHE 1;

CREATE TABLE "carts"(
  "id" integer NOT NULL DEFAULT nextval('carts_id_seq'),
  "users_id" integer NOT NULL,
  CONSTRAINT "carts_pkey" PRIMARY KEY(id)
);

CREATE SEQUENCE cart_items_id_seq 
START WITH 1 
INCREMENT BY 1 
MINVALUE 1 
NO MAXVALUE CACHE 1;

CREATE TABLE "cart_items"(
  "id" integer NOT NULL DEFAULT nextval('cart_items_id_seq'),
  "carts_id" integer NOT NULL,
  "products_id" integer NOT NULL,
  "quantity" integer NOT NULL,
  CONSTRAINT "cart_items_pkey" PRIMARY KEY(id)
);

ALTER TABLE "stores" 
ADD CONSTRAINT "fk_stores_addresses" FOREIGN KEY ("addresses_id") REFERENCES "addresses"("id");

ALTER TABLE "users" 
ADD CONSTRAINT "fk_users_addresses" FOREIGN KEY ("addresses_id") REFERENCES "addresses"("id");

ALTER TABLE "carts" 
ADD CONSTRAINT "fk_carts_users" FOREIGN KEY ("users_id") REFERENCES "users"("id");

ALTER TABLE "cart_items" 
ADD CONSTRAINT "fk_cart_items_carts" FOREIGN KEY ("carts_id") REFERENCES "carts"("id"),
ADD CONSTRAINT "fk_cart_items_products" FOREIGN KEY ("products_id") REFERENCES "products"("id");

ALTER TABLE "employees" 
ADD CONSTRAINT "fk_employees_stores" FOREIGN KEY ("stores_id") REFERENCES "stores"("id"),
ADD CONSTRAINT "fk_employees_users" FOREIGN KEY ("users_id") REFERENCES "users"("id");

ALTER TABLE "products" 
ADD CONSTRAINT "fk_products_stores" FOREIGN KEY ("stores_id") REFERENCES "stores"("id"),
ADD CONSTRAINT "fk_products_manufacturers" FOREIGN KEY ("manufacturers_id") REFERENCES "manufacturers"("id");

ALTER TABLE "photos" 
ADD CONSTRAINT "fk_photos_products" FOREIGN KEY ("products_id") REFERENCES "products"("id");

ALTER TABLE "orders" 
ADD CONSTRAINT "fk_orders_users" FOREIGN KEY ("users_id") REFERENCES "users"("id");

ALTER TABLE "order_details" 
ADD CONSTRAINT "fk_order_details_orders" FOREIGN KEY ("orders_id") REFERENCES "orders"("id"),
ADD CONSTRAINT "fk_order_details_products" FOREIGN KEY ("products_id") REFERENCES "products"("id");

TRUNCATE TABLE "order_details", "orders", "cart_items", "carts", "employees", "products", "users", "stores", "addresses", "manufacturers", "photos" RESTART IDENTITY CASCADE;

INSERT INTO "manufacturers" ("id", "name")
VALUES
(1, 'Santa Cruz'),
(2, 'Baker'),
(3, 'Palace'),
(4, 'Heroin');

INSERT INTO "addresses" ("country", "city", "street", "building_number", "apartment_number", "postal_code")
VALUES
    ('Poland', 'Warsaw', 'Grzybowska', '21', NULL, '00-132'),
    ('Poland', 'Warsaw', 'Poleczki', '37', NULL, '02-822'),
    ('Poland', 'Cisie', 'Główna', '6', NULL, '05-074'),
    ('Poland', 'Warsaw', 'Kozia', '37', NULL, '00-070');  

INSERT INTO "stores" ("id", "name", "email_address", "phone_number", "addresses_id")
VALUES
(1, 'essa sk8', 'info@essa.com', '1234567890', 1);

INSERT INTO "users" ("username", "password", "email_address", "phone_number", "name", "last_name", "second_name", "creation_date", "is_staff", "addresses_id")
VALUES
('gkoms', '3oda', 'gbrzeczyszczykiewicz@onet.pl', '882243567', 'Grzegorz', 'Brzęczyszczykiewicz', NULL, '2025-05-11', true, 2),
('karma', 'medusa2115', 'kamilapilot@gmail.com', '243567882', 'Kamila', 'Pilot', NULL, '2025-05-11', true, 3),
('milosz2009', '#54&cv56', 'milosz2009@gmail.com', '567243882', 'Miłosz', 'Smoczek', NULL, '2025-05-11', false, 4);

INSERT INTO "carts" ("users_id") VALUES (1), (2), (3);

INSERT INTO "employees" ("gender", "birth_date", "pesel", "hire_date", "bank_account_number", "stores_id", "users_id")
VALUES
('m', '2003-04-01', '03240101739', '2025-05-11', '12345678901234567890123456', 1, 1),
('k', '1977-12-3', '77120312345', '2025-04-04', '65432109876543210987654321' , 1, 2);

INSERT INTO "products" (
    "name", 
    "description", 
    "price", 
    "size", 
    "material", 
    "tracks", 
    "concave", 
    "wheels", 
    "bearings", 
    "instock", 
    "stores_id", 
    "manufacturers_id"
)
VALUES
(
    'Santa Cruz Screaming Hand Complete', 
    'Klasyczna kompletna deskorolka z ikoną Screaming Hand. Idealna dla początkujących i średniozaawansowanych.', 
    489.00, 
    '8.0"', 
    'Klon kanadyjski 7-warstw', 
    'Bullet 130mm', 
    'Medium', 
    'OJ Wheels 52mm 95a', 
    'ABEC 5', 
    15, 
    1, 
    1
),
(
    'Santa Cruz Classic Dot', 
    'Ponadczasowy design z logiem Dot. Szeroki blat zapewnia stabilność na rampie.', 
    499.00, 
    '8.25"', 
    'Klon północnoamerykański', 
    'Bullet 140mm', 
    'Medium', 
    'Slime Balls 53mm', 
    'ABEC 5', 
    8, 
    1, 
    1
),
(
    'Baker Brand Logo Red/Black', 
    'Flagowy model Baker. Agresywny kształt idealny do streetu.', 
    529.00, 
    '8.125"', 
    'Klon twardy', 
    'Baker Trucks', 
    'Mellow', 
    'Baker 52mm 99a', 
    'Baker Abec 7', 
    12, 
    1, 
    2
),
(
    'Baker Tyson Peterson Complete', 
    'Pro model Tysona Petersona. Świetny pop i wytrzymałość.', 
    549.00, 
    '8.25"', 
    'Klon kanadyjski', 
    'Independent 144', 
    'Steep', 
    'Spitfire 52mm', 
    'Bones Reds', 
    5, 
    1, 
    2
),
(
    'Palace Pro S25', 
    'Stylowa deska od londyńskiej marki Palace. Wysoka jakość wykończenia.', 
    599.00, 
    '8.375"', 
    'Klon premium', 
    'Silver M-Class', 
    'High', 
    'Palace 54mm', 
    'Palace GP 7', 
    4, 
    1, 
    3
),
(
    'Heroin Eggzilla', 
    'Kultowy kształt "jajka" od Heroin Skateboards. Bardzo szeroka deska do zabawy na streecie.', 
    559.00, 
    '9.0"', 
    'Klon + Epoksyd', 
    'Ace 55', 
    'Low', 
    'Heroin 54mm Soft', 
    'Abec 7', 
    3, 
    1, 
    4
);

INSERT INTO "orders" ("price", "order_date", "order_status", "users_id") 
VALUES (2445.00, '2025-05-11', 'PAID', 1);

INSERT INTO "order_details" ("orders_id", "products_id", "quantity", "fixed_price") 
VALUES (1, 1, 5, 489.00);

INSERT INTO "cart_items" ("carts_id", "products_id", "quantity")
VALUES (1, 2, 1);