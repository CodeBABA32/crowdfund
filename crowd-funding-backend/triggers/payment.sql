
DELIMITER $$

CREATE TRIGGER ValidateAmountBeforeInsert
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
  IF NEW.amount <= 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Amount must be greater than 0';
  END IF;
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER ValidateAmountBeforeUpdate
BEFORE UPDATE ON Payment
FOR EACH ROW
BEGIN
  IF NEW.amount <= 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Amount must be greater than 0';
  END IF;
END$$

DELIMITER ;



DELIMITER $$

CREATE TRIGGER SetDefaultPaymentStatusBeforeInsert
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
  IF NEW.paymentStatus IS NULL THEN
    SET NEW.paymentStatus = 'Failed';
  END IF;
END$$

DELIMITER ;





DELIMITER $$

CREATE TRIGGER LogPaymentInsert
AFTER INSERT ON Payment
FOR EACH ROW
BEGIN
  INSERT INTO PaymentLogs (paymentID, changeType, newAmount)
  VALUES (NEW.paymentID, 'INSERT', NEW.amount);
END$$

DELIMITER ;



DELIMITER $$

CREATE TRIGGER LogPaymentUpdate
AFTER UPDATE ON Payment
FOR EACH ROW
BEGIN
  INSERT INTO PaymentLogs (paymentID, changeType, oldAmount, newAmount)
  VALUES (OLD.paymentID, 'UPDATE', OLD.amount, NEW.amount);
END$$

DELIMITER ;



DELIMITER $$

CREATE TRIGGER LogPaymentDelete
AFTER DELETE ON Payment
FOR EACH ROW
BEGIN
  INSERT INTO PaymentLogs (paymentID, changeType, oldAmount)
  VALUES (OLD.paymentID, 'DELETE', OLD.amount);
END$$

DELIMITER ;





DELIMITER $$

CREATE TRIGGER ValidateForeignKeysBeforeInsert
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
  DECLARE userExists INT;
  DECLARE campaignExists INT;

  SELECT COUNT(*) INTO userExists FROM Users WHERE id = NEW.userID;
  IF userExists = 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'The specified userID does not exist.';
  END IF;

  SELECT COUNT(*) INTO campaignExists FROM Campaign WHERE CampaignID = NEW.campaignID;
  IF campaignExists = 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'The specified campaignID does not exist.';
  END IF;
END$$

DELIMITER ;




