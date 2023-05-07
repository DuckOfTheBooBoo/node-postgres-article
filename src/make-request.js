/**
 * A function to wrap XMLHttpRequest()
 * @param {String} method Specify the HTTP request method.
 * @param {String} endpoint Specify the HTTP endpoint.
 * @return {Promise}
 */
function makeRequest(method, endpoint) {
  return new Promise((resolve, reject) => {

    const request = new XMLHttpRequest();
    request.open(method, endpoint, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        const response = JSON.parse(request.responseText);
        resolve(response);

      } else {
        const response = JSON.parse(request.responseText);
        reject(response);
      }
    };

    request.onerror = function() {
      reject(new Error('Network error.'));
    };

    request.send();
  });
}
