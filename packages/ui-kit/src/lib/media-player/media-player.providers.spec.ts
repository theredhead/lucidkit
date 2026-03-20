import {
  dailymotionEmbedProvider,
  vimeoEmbedProvider,
  youTubeEmbedProvider,
} from "./media-player.providers";

describe("youTubeEmbedProvider", () => {
  it("should resolve youtube.com/watch?v= URLs", () => {
    const result = youTubeEmbedProvider.resolve(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    );
    expect(result).toBeTruthy();
    expect(result!.iframeSrc).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
    expect(result!.providerName).toBe("YouTube");
  });

  it("should resolve youtube.com without www", () => {
    const result = youTubeEmbedProvider.resolve(
      "https://youtube.com/watch?v=abc123",
    );
    expect(result).toBeTruthy();
    expect(result!.iframeSrc).toBe("https://www.youtube.com/embed/abc123");
  });

  it("should resolve youtu.be short URLs", () => {
    const result = youTubeEmbedProvider.resolve("https://youtu.be/dQw4w9WgXcQ");
    expect(result).toBeTruthy();
    expect(result!.iframeSrc).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("should resolve youtube.com/embed/ URLs", () => {
    const result = youTubeEmbedProvider.resolve(
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
    );
    expect(result).toBeTruthy();
    expect(result!.iframeSrc).toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("should resolve youtube.com/shorts/ URLs", () => {
    const result = youTubeEmbedProvider.resolve(
      "https://www.youtube.com/shorts/abc123",
    );
    expect(result).toBeTruthy();
    expect(result!.iframeSrc).toBe("https://www.youtube.com/embed/abc123");
  });

  it("should resolve youtube.com/live/ URLs", () => {
    const result = youTubeEmbedProvider.resolve(
      "https://www.youtube.com/live/xyz789",
    );
    expect(result).toBeTruthy();
    expect(result!.iframeSrc).toBe("https://www.youtube.com/embed/xyz789");
  });

  it("should return null for non-YouTube URLs", () => {
    expect(youTubeEmbedProvider.resolve("https://vimeo.com/12345")).toBeNull();
    expect(youTubeEmbedProvider.resolve("https://example.com")).toBeNull();
    expect(youTubeEmbedProvider.resolve("not-a-url")).toBeNull();
  });

  it("should return null for YouTube URLs without video ID", () => {
    expect(youTubeEmbedProvider.resolve("https://www.youtube.com/")).toBeNull();
    expect(
      youTubeEmbedProvider.resolve("https://www.youtube.com/feed"),
    ).toBeNull();
  });
});

describe("vimeoEmbedProvider", () => {
  it("should resolve vimeo.com/VIDEO_ID URLs", () => {
    const result = vimeoEmbedProvider.resolve("https://vimeo.com/76979871");
    expect(result).toBeTruthy();
    expect(result!.iframeSrc).toBe("https://player.vimeo.com/video/76979871");
    expect(result!.providerName).toBe("Vimeo");
  });

  it("should resolve www.vimeo.com URLs", () => {
    const result = vimeoEmbedProvider.resolve("https://www.vimeo.com/76979871");
    expect(result).toBeTruthy();
    expect(result!.iframeSrc).toBe("https://player.vimeo.com/video/76979871");
  });

  it("should resolve player.vimeo.com/video/ URLs", () => {
    const result = vimeoEmbedProvider.resolve(
      "https://player.vimeo.com/video/76979871",
    );
    expect(result).toBeTruthy();
    expect(result!.iframeSrc).toBe("https://player.vimeo.com/video/76979871");
  });

  it("should return null for non-Vimeo URLs", () => {
    expect(
      vimeoEmbedProvider.resolve("https://www.youtube.com/watch?v=abc"),
    ).toBeNull();
    expect(vimeoEmbedProvider.resolve("not-a-url")).toBeNull();
  });

  it("should return null for Vimeo URLs without numeric ID", () => {
    expect(vimeoEmbedProvider.resolve("https://vimeo.com/channels")).toBeNull();
  });
});

describe("dailymotionEmbedProvider", () => {
  it("should resolve dailymotion.com/video/ URLs", () => {
    const result = dailymotionEmbedProvider.resolve(
      "https://www.dailymotion.com/video/x7zzrmj",
    );
    expect(result).toBeTruthy();
    expect(result!.iframeSrc).toBe(
      "https://www.dailymotion.com/embed/video/x7zzrmj",
    );
    expect(result!.providerName).toBe("Dailymotion");
  });

  it("should resolve dai.ly short URLs", () => {
    const result = dailymotionEmbedProvider.resolve("https://dai.ly/x7zzrmj");
    expect(result).toBeTruthy();
    expect(result!.iframeSrc).toBe(
      "https://www.dailymotion.com/embed/video/x7zzrmj",
    );
  });

  it("should resolve dailymotion.com without www", () => {
    const result = dailymotionEmbedProvider.resolve(
      "https://dailymotion.com/video/x7zzrmj",
    );
    expect(result).toBeTruthy();
    expect(result!.iframeSrc).toBe(
      "https://www.dailymotion.com/embed/video/x7zzrmj",
    );
  });

  it("should return null for non-Dailymotion URLs", () => {
    expect(
      dailymotionEmbedProvider.resolve("https://vimeo.com/12345"),
    ).toBeNull();
    expect(dailymotionEmbedProvider.resolve("not-a-url")).toBeNull();
  });
});
