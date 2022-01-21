CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          author TEXT NOT NULL,
          review_id INT NOT NULL,
          votes INT DEFAULT 0 NOT NULL,
          body TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (author) REFERENCES users(username),
          FOREIGN KEY (review_id) REFERENCES reviews(review_id)
        );