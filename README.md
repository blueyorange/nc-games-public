# My-Game-Reviews

Hosted at:
https://my-game-reviews.herokuapp.com/

## Summary

This is an api to serve reviews of board games. Users may post reviews, whicha are linked to categories. Users may also comment on the reviews. Reviews and comments can receive votes, which can be incremented or decrememted via the api.

## Instructions

Created using node v17.1.0 and Postgres v14.1
Clone using:
git clone https://github.com/blueyorange/be-nc-games.git

Install dependencies using
`npm install`

Create .env files in root:
.env.development should contain the line `PGDATABASE=nc_games`
.env.test should contain the line `PGDATABASE=nc_games_test`

Run tests with `npm run test`

Seed local db with `npm run seed`
