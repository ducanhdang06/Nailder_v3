-- USERS
CREATE TABLE users (
  id UUID PRIMARY KEY, -- Cognito user sub
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('technician', 'customer')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- DESIGNS
CREATE TABLE designs (
  id UUID PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  tech_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  likes INT DEFAULT 0
);

CREATE TABLE design_tags (
  design_id UUID REFERENCES designs(id) ON DELETE CASCADE,
  tag TEXT,
  PRIMARY KEY (design_id, tag)
);

-- MATCHES (swipes)
CREATE TABLE matches (
  id UUID PRIMARY KEY,
  design_id UUID REFERENCES designs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  liked BOOLEAN NOT NULL, -- true if liked, false if swiped left
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, design_id) -- Prevents duplicate swipes
);

-- CHAT
CREATE TABLE chat (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES users(id) ON DELETE CASCADE,
  design_id UUID REFERENCES designs(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

