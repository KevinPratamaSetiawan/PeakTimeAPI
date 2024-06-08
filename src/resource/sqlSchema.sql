show databases;

use peaktime;

show tables;

SELECT * FROM accounts;
SELECT * FROM events;
SELECT * FROM notes;
SELECT * FROM notifications;
SELECT * FROM forms;

DELETE FROM forms;

DROP TABLE forms;
DROP TABLE notifications;
DROP TABLE notes;
DROP TABLE events;
DROP TABLE accounts;

CREATE TABLE accounts(
	id varchar(16) NOT NULL,
    email varchar(255) NOT NULL,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    profilePictureUrl varchar(2048),
    authenticationCode varchar(4) NOT NULL,
    chronotype varchar(255),
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

CREATE TABLE forms(
	id varchar(5) NOT NULL,
    fkUserIdForms varchar(16) NOT NULL,
    userAge bigint NOT NULL,
    taskType bigint NOT NULL,
    averageRestHour bigint NOT NULL,
    moodBeforeWork bigint NOT NULL,
    taskDeadline bigint NOT NULL,
    taskImportance bigint NOT NULL,
    sleepAverageHour bigint NOT NULL,
    taskUrgency bigint NOT NULL,
    totalDistraction bigint NOT NULL,
    averageWorkHour bigint NOT NULL,
    workDays bigint NOT NULL,
    createdAt datetime NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fkUserIdForms FOREIGN KEY (fkUserIdForms) REFERENCES accounts(id) ON DELETE CASCADE
);