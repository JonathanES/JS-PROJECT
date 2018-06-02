-- Delete and recreate the SmartPick database
\c postgres;
DROP DATABASE youtuberepeat;
CREATE DATABASE youtuberepeat;
\c youtuberepeat;

-- Create tables
CREATE TABLE T_User (
  Id                SERIAL          PRIMARY KEY NOT NULL,
  Email             VARCHAR(50)     UNIQUE NOT NULL,
  Password          CHAR(32)        NOT NULL,
  Firstname         VARCHAR(50)     NOT NULL,
  Lastname          VARCHAR(50)     NOT NULL
);

CREATE TABLE T_Videos (
  URL				VARCHAR(256)             PRIMARY KEY NOT NULL ,
  Name      VARCHAR(128)             NOT NULL
);


CREATE TABLE T_History (
  Id               SERIAL           PRIMARY KEY NOT NULL,
  URL				        VARCHAR(256)    NOT NULL references T_Videos (URL) ,
  Id_user           BIGINT          NOT NULL references T_User (Id),
  DatePost          TIMESTAMP       NOT NULL
);

CREATE TABLE T_Favorite (
  Id                SERIAL          PRIMARY KEY NOT NULL,
  Id_user           BIGINT          NOT NULL references T_User (Id),
  Id_videos         VARCHAR(256)    NOT NULL references T_Videos (URL)
);

CREATE TABLE T_Comment (
  Id                SERIAL          PRIMARY KEY NOT NULL,
  Id_user           BIGINT          NOT NULL references T_User (Id),
  Id_videos         VARCHAR(256)    NOT NULL references T_Videos (URL) ,
  DatePost          TIMESTAMP       NOT NULL,
  Grade             INT             CHECK (Grade > 0 AND Grade <= 5),
  Comment           VARCHAR (1024)
);





