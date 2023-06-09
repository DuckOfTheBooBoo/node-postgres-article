/* eslint-disable max-len */
const pg = require('pg');
const CONFIG = require('../config');
const {titleToValidURL, makeUniqueId} = require('./utils');

pg.types.setTypeParser(1114, (stringValue) => {
  return stringValue;
});

pg.types.setTypeParser(1082, (stringValue) => {
  return stringValue;
});

const pool = new pg.Pool({
  user: CONFIG.POSTGRES_USER,
  password: CONFIG.POSTGRES_PASS,
  host: CONFIG.POSTGRES_HOST,
  database: CONFIG.POSTGRES_DB,
  port: 5432,
});


const TABLE = CONFIG.POSTGRES_DB_TABLE;

const getArticles = (request, h) => {

  // Get Article by ID
  if (Object.keys(request.query).length > 0) {
    const {id} = request.query;
    return pool.query(`SELECT * FROM ${TABLE} WHERE id=$1`, [id])
        .then((data) => {

          if (data.rows.length > 0) {
            return h.response({
              status: 'success',
              data: data.rows,
            }).code(200);
          }

          return h.response({
            status: 'fail',
            message: `No article with ID ${id}`,
          }).code(404);

        })
        .catch((error) => {

          if (error.code === 'ECONNREFUSED') {
            return h.response({status: 'fail', message: 'Unable to connect to database.'}).code(500);
          }

          return h.response({
            status: 'fail',
            message: error.message,
          }).code(400);
        });
  }

  // Returns All Articles if no id query is provided.
  return pool.query(`SELECT * FROM ${TABLE} ORDER BY id ASC`)
      .then((data) => {
        return h.response({
          status: 'success',
          data: data.rows,
        }).code(200);
      })
      .catch((error) => {

        if (error.code === 'ECONNREFUSED') {
          return h.response({status: 'fail', message: 'Unable to connect to database.'}).code(500);
        }

        return h.response({
          status: 'fail',
          message: error.message,
        }).code(400);
      });
};

const addArticle = (request, h) => {
  const {title, content} = request.payload;
  const urlPath = titleToValidURL(title);
  const uid = makeUniqueId();

  if (title && content) {
    return pool.query(`INSERT INTO ${TABLE} (u_id, title, url_path, content) VALUES ($1, $2, $3, $4) RETURNING *`, [uid, title, urlPath, content])
        .then((data) => {
          return h.response({
            status: 'success',
            message: `Article added with the ID of ${data.rows[0].id}`,
          }).code(201);
        })
        .catch((error) => {

          if (error.code === 'ECONNREFUSED') {
            return h.response({status: 'fail', message: 'Unable to connect to database.'}).code(500);
          }

          return h.response({
            status: 'fail',
            message: error.message,
          }).code(400);
        });
  }

  return h.response({
    status: 'fail',
    message: 'title and/or content cannot be empty',
  }).code(400);
};

const updateArticle = (request, h) => {
  const {id=0, uid=''} = request.query;
  const {title, content} = request.payload;
  const urlPath = titleToValidURL(title);

  // Check if row with id exist
  return pool.query(`SELECT * FROM ${TABLE} WHERE id=$1 OR u_id=$2`, [id, uid])
      .then((data) => {
        if (data.rows.length !== 0) {
          return pool.query(`UPDATE ${TABLE} SET title=$1, url_path=$2, content=$3, date_updated=now() WHERE id=$4 OR u_id=$5`, [title, urlPath, content, id, uid])
              .then((data) => {
                return h.response({
                  status: 'success',
                  message: `Article updated succesfully`,
                }).code(200);
              })
              .catch((error) => {

                if (error.code === 'ECONNREFUSED') {
                  return h.response({status: 'fail', message: 'Unable to connect to database.'}).code(500);
                }

                return h.response({
                  status: 'fail',
                  message: error.message,
                }).code(400);
              });
        } else {
          return h.response({
            status: 'fail',
            message: `Article with ID ${id} doesn't exist`,
          }).code(404);
        }
      });
};

const deleteArticle = (request, h) => {
  const {id} = request.query;

  return pool.query(`DELETE FROM ${TABLE} WHERE id=$1`, [id])
      .then((data) => {

        if (data.rowCount > 0) {
          return h.response({
            status: 'success',
            message: `Article with ID ${id} deleted successfuly`,
          }).code(200);
        }

        return h.response({
          status: 'fail',
          message: `Article with ID ${id} doesn't exist`,
        }).code(404);
      })
      .catch((error) => {

        if (error.code === 'ECONNREFUSED') {
          return h.response({status: 'fail', message: 'Unable to connect to database.'}).code(500);
        }

        return h.response({
          status: 'fail',
          message: error.message,
        }).code(400);
      });
};

const serveArticle = (request, h) => {
  const {param} = request.params;

  return pool.query(`SELECT * FROM ${TABLE} WHERE url_path=$1`, [param])
      .then((data) => {

        // Check if query returns a data
        if (data.rows.length > 0) {
          const queryRes = data.rows[0];
          const title = queryRes.title;
          const dateCreated = queryRes.date_created;
          const dateUpdated = queryRes.date_updated;
          const content = queryRes.content;

          return h.view('post.hbs', {
            title: title,
            date_created: dateCreated,
            date_updated: dateUpdated,
            content: content,
          });
        }

        return h.response({status: 'fail', message: 'Article not found'}).code(404);
      });
};

const editArticleNonAPI = (request, h) => {
  const {param} = request.params;

  return pool.query(`SELECT * FROM ${TABLE} WHERE u_id=$1`, [param])
      .then((data) => {

        // Check if query returns a data
        if (data.rows.length > 0) {
          const queryRes = data.rows[0];
          const title = queryRes.title;
          const content = queryRes.content;

          return h.view('edit.hbs', {
            title: title,
            content: content,
          });
        }

        return h.response({status: 'fail', message: 'Article not found'}).code(404);
      });
};

const deleteArticleNonAPI = (request, h) => {
  const {param} = request.params;

  return pool.query(`DELETE FROM ${TABLE} WHERE url_path=$1`, [param])
      .then((data) => {
        return h.redirect('/');
      });
};

const makeTableIfNotExist = async () => {
  const client = new pg.Client({
    user: CONFIG.POSTGRES_USER,
    password: CONFIG.POSTGRES_PASS,
    host: CONFIG.POSTGRES_HOST,
    database: CONFIG.POSTGRES_DB,
    port: 5432,
  });

  try {

    await client.connect();
    await client.query(`CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      u_id VARCHAR(6) NOT NULL,
      title VARCHAR(120) NOT NULL,
      date_created TIMESTAMP DEFAULT now() NOT NULL,
      date_updated TIMESTAMP,
      url_path VARCHAR(150) NOT NULL,
      content TEXT NOT NULL
    );`);
    return true;
  } catch (error) {
    console.error(error.stack);
    return false;
  } finally {
    await client.end();
  }
};

makeTableIfNotExist();

module.exports = {
  getArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  serveArticle,
  editArticleNonAPI,
  deleteArticleNonAPI,
};
