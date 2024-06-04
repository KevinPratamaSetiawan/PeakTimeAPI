show databases;

use peaktime;

show tables;

SELECT * FROM accounts;
SELECT * FROM events;
SELECT * FROM notes;
SELECT * FROM notifications;

DELETE FROM accounts;

DROP TABLE notifications;
DROP TABLE notes;
DROP TABLE events;
DROP TABLE accounts;

CREATE TABLE accounts(
	id varchar(16) NOT NULL,
    email varchar(255) NOT NULL,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    birthdate date,
    profilePictureUrl varchar(2048),
    authenticationCode varchar(4) NOT NULL, 
    createdAt datetime NOT NULL,
    updatedAt datetime NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE events(
	id varchar(10) NOT NULL,
    fkUserIdEvents varchar(16) NOT NULL,
    title varchar(255) NOT NULL,
    description varchar(255),
    startDay date NOT NULL,
    finishDay date NOT NULL,
    startTime time NOT NULL,
    finishTime time NOT NULL,
    finishStatus boolean NOT NULL,
    createdAt datetime NOT NULL,
    updatedAt datetime NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fkUserIdEvents FOREIGN KEY (fkUserIdEvents) REFERENCES accounts(id) ON DELETE CASCADE
);

CREATE TABLE notes(
	id varchar(10) NOT NULL,
    fkUserIdNotes varchar(16) NOT NULL,
    title varchar(255) NOT NULL,
    description varchar(255),
    createdAt datetime NOT NULL,
    updatedAt datetime NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fkUserIdNotes FOREIGN KEY (fkUserIdNotes) REFERENCES accounts(id) ON DELETE CASCADE
);

CREATE TABLE notifications(
	id varchar(10) NOT NULL,
    fkUserIdNotifications varchar(16) NOT NULL,
    title varchar(255) NOT NULL,
    description varchar(255),
    createdAt datetime NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fkUserIdNotifications FOREIGN KEY (fkUserIdNotifications) REFERENCES accounts(id) ON DELETE CASCADE
);