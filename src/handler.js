/* eslint-disable max-len */
const {Pool} = require('pg');
const CONFIG = require('../config');

const pool = new Pool({
  user: CONFIG.POSTGRES_USER,
  password: CONFIG.POSTGRES_PASS,
  host: CONFIG.POSTGRES_HOST,
  database: CONFIG.POSTGRES_DB,
  port: 5432,
});
const TABLE = CONFIG.POSTGRES_DB_TABLE;

const getArticles = (request, h) => {
  let response;

  // Get Article by ID
  if (Object.keys(request.query).length > 0) {
    const {id} = request.query;
    return pool.query(`SELECT * FROM ${TABLE} WHERE id=${id}`)
        .then((data) => {
          response = h.response({
            status: 'success',
            data: data.rows,
          });
          response.code(200);
          return response;
        })
        .catch((error) => {
          response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(400);
          return response;
        });
  }

  // Returns All Articles if no id query is provided.
  return pool.query(`SELECT * FROM ${TABLE} ORDER BY id ASC`)
      .then((data) => {
        response = h.response({
          status: 'success',
          data: data.rows,
        });
        response.code(200);
        return response;
      })
      .catch((error) => {
        response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(400);
        return response;
      });
};

const getArticleById = (request, h) => {
  const {id} = request.params;
  console.log(id);
};

module.exports = {
  getArticles,
};
