-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the techniques table
CREATE TABLE IF NOT EXISTS techniques (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    difficulty VARCHAR(50) CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    category VARCHAR(100),
    video_url TEXT NOT NULL,  -- Link to AWS S3 stored video
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    technique_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (technique_id) REFERENCES techniques(id) ON DELETE CASCADE,
    UNIQUE (user_id, technique_id) -- Prevent duplicate favorites
);

CREATE TABLE IF NOT EXISTS user_favorites (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    technique_id INT REFERENCES techniques(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, technique_id)
);