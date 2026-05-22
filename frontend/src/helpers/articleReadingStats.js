const WORDS_PER_MINUTE = 300;

function getArticleReadingStats(body = "") {
  const wordCount = body.replace(/\s/g, "").length;
  const readingMinutes = wordCount === 0 ? 0 : Math.ceil(wordCount / WORDS_PER_MINUTE);

  return { wordCount, readingMinutes };
}

export default getArticleReadingStats;
