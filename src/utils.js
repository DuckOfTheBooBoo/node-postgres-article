/**
 * Takes string, return into valid url path
 * @param {String} title
 * @return {String}
 */
function titleToValidURL(title) {
  const lowerTitle = title.toLowerCase();
  let validURL = '';

  for (let i = 0; i < lowerTitle.length; i+=1) {
    const char = lowerTitle.charAt(i);

    if (char === ' ') {
      validURL += '-';
    } else if (char === ',' || char === ':') {
      validURL += '';
    } else {
      validURL += char;
    }
  }

  return validURL;
}

module.exports = {
  titleToValidURL,
};
