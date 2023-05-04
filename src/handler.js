const {getArticles} = require('./queries');

const getAllArticles = (request, h) => {
  let response;

  return getArticles()
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

module.exports = {
  getAllArticles,
};
