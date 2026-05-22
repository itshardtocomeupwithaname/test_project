import getArticleReadingStats from "./articleReadingStats";

describe("getArticleReadingStats", () => {
  it("counts article body characters excluding whitespace", () => {
    expect(getArticleReadingStats("你好 世界\nabc")).toEqual({
      wordCount: 7,
      readingMinutes: 1,
    });
  });

  it("rounds reading minutes up based on 300 words per minute", () => {
    expect(getArticleReadingStats("a".repeat(301))).toEqual({
      wordCount: 301,
      readingMinutes: 2,
    });
  });

  it("returns zero stats for empty body", () => {
    expect(getArticleReadingStats()).toEqual({
      wordCount: 0,
      readingMinutes: 0,
    });
  });
});
