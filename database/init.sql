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

CREATE TABLE design_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID REFERENCES designs(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES users(id) ON DELETE CASCADE,
  design_id UUID REFERENCES designs(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (customer_id, technician_id, design_id)
);

-- MESSAGES
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chat(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- TECHNICIAN PROFILES
CREATE TABLE technician_profiles (
  tech_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT DEFAULT '',
  phone_number TEXT DEFAULT '',
  location TEXT DEFAULT '',
  profile_image_url TEXT DEFAULT '',
  social_links JSONB DEFAULT '{}',
  years_experience INT DEFAULT 0,
  specialties TEXT[] DEFAULT '{}',
  updated_at TIMESTAMP DEFAULT NOW()
);


