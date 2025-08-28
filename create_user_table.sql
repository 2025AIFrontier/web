-- Drop table if exists
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    pw VARCHAR(255) NOT NULL
);

-- Insert sample users for testing
INSERT INTO users (id, pw) VALUES
('admin', 'admin123'),
('user123', 'password123'),
('john.doe', 'john123');

-- Verify table creation
SELECT * FROM users;