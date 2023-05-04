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
    return pool.query(`SELECT * FROM ${TABLE} WHERE id=$1`, [id])
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

const addArticle = (request, h) => {
  let response;
  const {title, content} = request.payload;

  return pool.query(`INSERT INTO ${TABLE} (title, content) VALUES ($1, $2) RETURNING *`, [title, content])
      .then((data) => {
        response = h.response({
          status: 'success',
          message: `Article added with the ID of ${data.rows[0].id}`,
        });
        response.code(201);
        return response;
      })
      .catch((error) => {
        response = h.response({
          status: 'fail',
          meesage: error.message,
        });
        response.code(400);
        return response;
      });
};

const updateArticle = (request, h) => {
  const {id} = request.query;
  const {title, content} = request.payload;

  return pool.query(`UPDATE ${TABLE} SET title=$1, content=$2 WHERE id=$3`, [title, content, id])
      .then((data) => {
        response = h.response({
          status: 'success',
          message: `Article updated succesfully`,
        });
        response.code(200);
        return response;
      })
      .catch((error) => {
        response = h.response({
          status: 'fail',
          meesage: error.message,
        });
        response.code(400);
        return response;
      });
};

module.exports = {
  getArticles,
  addArticle,
  updateArticle,
};
