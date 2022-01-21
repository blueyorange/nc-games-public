CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        review_body TEXT NOT NULL,
        designer TEXT NOT NULL,
        review_img_url TEXT,
        votes INT DEFAULT 0 NOT NULL,
        category TEXT NOT NULL,
        owner TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner) REFERENCES users(username),
        FOREIGN KEY (category) REFERENCES categories(slug)
      );