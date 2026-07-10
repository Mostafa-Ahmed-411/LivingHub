const PHONE_REGEX = /(?:\+?2?0?1[0125]\d{8})/;
const URL_REGEX = /https?:\/\/\S+/i;

const containsBlockedContent = (text) => {
  if (PHONE_REGEX.test(text)) {
    return 'Sharing phone numbers is not allowed. Please keep communication within the platform.';
  }

  if (URL_REGEX.test(text)) {
    return 'Sharing external links is not allowed. Please keep communication within the platform.';
  }

  return null;
};

module.exports = { containsBlockedContent };
