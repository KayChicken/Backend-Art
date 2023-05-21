CREATE TABLE users (
	user_id SERIAL PRIMARY KEY,
	user_fio VARCHAR(128),
	user_login VARCHAR(64),
	user_hashPassword TEXT,
	user_age INT,
	user_email VARCHAR(128),
	user_phone VARCHAR(20),
	user_friends INT ARRAY,
	user_photo TEXT,
	user_education VARCHAR(128),
	user_rating INT,
	user_achievements INT ARRAY
)

