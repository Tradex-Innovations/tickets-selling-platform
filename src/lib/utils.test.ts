import { describe, expect, it } from "vitest";
import { formatCalendarDay, formatDateTime, formatDayMonth, formatEventDate, formatNumber, formatShortDate } from "@/lib/utils";

describe("deterministic presentation formatters", () => {
  it("formats zoned event dates in Sri Lankan wall time", () => {
    expect(formatEventDate("2026-10-17T19:00:00+05:30")).toBe("Sat, Oct 17 · 7:00 PM");
  });

  it("treats datetime-local and date-only inputs as platform wall time", () => {
    expect(formatDateTime("2026-12-12T19:00")).toBe("12 Dec 2026 · 7:00 PM");
    expect(formatDayMonth("2026-09-05")).toBe("05 Sep");
  });

  it("formats UTC timestamps in Asia/Colombo without depending on host locale", () => {
    expect(formatDateTime("2026-08-30T04:12:00.000Z")).toBe("30 Aug 2026 · 9:42 AM");
    expect(formatShortDate("2026-08-30T04:12:00.000Z")).toBe("30 Aug 2026");
    expect(formatCalendarDay("2026-08-30T04:12:00.000Z")).toEqual({ day: "30", month: "Aug" });
  });

  it("groups numbers consistently", () => {
    expect(formatNumber(1288)).toBe("1,288");
    expect(formatNumber(-12500.5)).toBe("-12,500.5");
  });
});
