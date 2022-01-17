CREATE TABLE reviews (
        review_id INT PRIMARY KEY,
        title TEXT,
        review_body TEXT,
        designer TEXT,
        review_img_url TEXT,
        votes INT DEFAULT 0,
        category TEXT,
        owner TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner) REFERENCES users(username),
        FOREIGN KEY (category) REFERENCES categories(slug)
      );