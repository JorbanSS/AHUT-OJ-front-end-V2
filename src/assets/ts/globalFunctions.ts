import { TimeType } from "@/type";

// 转换工具
export class ConvertTools {
  // 时间戳 => 时间
  public static Timestamp2Time(timestamp: number): TimeType {
    if (timestamp <= 1e10) timestamp *= 1000;
    let t = new Date(timestamp);
    let time: TimeType = {
      year: t.getFullYear(),
      month: t.getMonth() + 1,
      day: t.getDate(),
      hour: t.getHours(),
      minute: t.getMinutes(),
      second: t.getSeconds(),
    };
    return time;
  }

  public static PrintTime(time: TimeType | number, showDate: number = 0, showSecond: number = 0): string {
    if (typeof time === "number") time = this.Timestamp2Time(time);
    let ret = '';
    if (showDate) ret += `${time.year}年${time.month.toString().padStart(2, '0')}月${time.day.toString().padStart(2, '0')}日 `;
    ret += `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
    if (showSecond) ret += `:${time.second.toString().padStart(2, '0')}`;
    return ret;
  }

  // 两个时间戳 => 时间间隔
  public static TimeInterval(start: number, end: number): number {
    if (start <= 1e10) start *= 1000;
    if (end <= 1e10) end *= 1000;
    let interval = Math.abs(end - start);
    return interval;
  }

  // 十进制数 => 二十六进制字母
  public static Number2Alpha(num: number): string {
    let alpha = "";
    while (num) {
      alpha = String.fromCharCode((num - 1) % 26 + 65) + alpha;
      num = Math.floor((num - 1) / 26);
    }
    return alpha;
  }

  public static Percentage(m: number, n: number, isCeil: number = 0): number {
    if (n == 0) return 0;
    if (isCeil) return Math.ceil(m / n * 100);
    return Math.floor(m / n * 100);
  }
}