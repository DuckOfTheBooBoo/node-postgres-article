/**
 * Takes string, return into valid url path
 * @param {String} title
 * @return {String}
 */
function titleToValidURL(title) {
  const lowerTitle = title.toLowerCase();
  let validURL = '';
  const forbiddenChar = [',', ':', '?'];

  for (let i = 0; i < lowerTitle.length; i+=1) {
    const char = lowerTitle.charAt(i);

    if (char === ' ') {
      validURL += '-';
    } else if (forbiddenChar.includes(char)) {
      validURL += '';
    } else {
      validURL += char;
    }
  }

  return validURL;
}

/**
 * Generate of 6 char long of unique id
 * @return {String} - 6 Char of unique id.
 */
function makeUniqueId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  let uid = '';

  while (uid.length < 6) {
    const charIndex = Math.floor(Math.random() * chars.length);
    const char = chars.charAt(charIndex);

    uid += char;
  }

  return uid;
}

module.exports = {
  titleToValidURL,
  makeUniqueId,
};
