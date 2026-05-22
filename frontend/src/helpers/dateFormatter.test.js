import dateFormatter, { lastEditedFormatter } from "./dateFormatter";

it("should format an ISO string", () => {
  const ISOString = "2020-01-01T12:11:08.212Z";

  expect(dateFormatter(ISOString)).toBe("January 1, 2020");
});

it("should format an ISO string as last edited hours ago", () => {
  const ISOString = "2020-01-01T12:11:08.212Z";
  const now = new Date("2020-01-01T15:41:08.212Z");

  expect(lastEditedFormatter(ISOString, now)).toBe("最后编辑于 3 小时前");
});
