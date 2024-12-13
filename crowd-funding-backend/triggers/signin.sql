-- Create the user_logs table if not exists
CREATE TABLE IF NOT EXISTS user_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    action VARCHAR(50) NOT NULL,
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create the logins table to track sign-ins
CREATE TABLE IF NOT EXISTS logins (
    login_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create a trigger for logging user sign-ins
DELIMITER $$

CREATE TRIGGER after_user_login
AFTER INSERT ON logins
FOR EACH ROW
BEGIN
    INSERT INTO user_logs (user_id, action, log_time)
    VALUES (NEW.user_id, 'User Signed In', NOW());
END;

DELIMITER ;
