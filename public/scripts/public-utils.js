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

/**
 * Return date from raw date string to date type with formatted based on options
 * @param {String} locale e.g. en, fr, id
 * @param {String} dateString Valid string for Date()
 * @return {Date}
 */
function formatDate(locale, dateString) {
  if (dateString) {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return;
}
