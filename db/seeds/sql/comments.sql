CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          author TEXT,
          review_id INT,
          votes INT DEFAULT 0,
          FOREIGN KEY (author) REFERENCES users(username),
          FOREIGN KEY (review_id) REFERENCES reviews(review_id)
        );