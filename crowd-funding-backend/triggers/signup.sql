-- Create the user_logs table for logging user activities
DROP TABLE IF EXISTS user_logs;

CREATE TABLE user_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    action VARCHAR(50) NOT NULL,
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Create a trigger function for logging user creation
DELIMITER $$
CREATE OR REPLACE FUNCTION log_user_creation()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert log entry into the user_logs table
    INSERT INTO user_logs (user_id, action, log_time)
    VALUES (NEW.id, 'User Created', NOW());
    RETURN NEW;
END;
$$
DELIMITER ;

-- Attach the trigger to the users table
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION log_user_creation();
