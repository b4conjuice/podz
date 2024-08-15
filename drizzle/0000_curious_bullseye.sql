CREATE TABLE IF NOT EXISTS "podz_favorite" (
	"id" serial PRIMARY KEY NOT NULL,
	"podcast_id" numeric,
	"name" varchar(256),
	"podcaster" varchar(256),
	"url" varchar(256)
);
