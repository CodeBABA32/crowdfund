DELIMITER $$

CREATE TRIGGER ValidateEndDateBeforeInsert
BEFORE INSERT ON Campaign
FOR EACH ROW
BEGIN
    IF NEW.EndDate <= NEW.StartDate THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'EndDate must be after StartDate';
    END IF;
END$$

CREATE TRIGGER ValidateEndDateBeforeUpdate
BEFORE UPDATE ON Campaign
FOR EACH ROW
BEGIN
    IF NEW.EndDate <= NEW.StartDate THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'EndDate must be after StartDate';
    END IF;
END$$

DELIMITER ;
