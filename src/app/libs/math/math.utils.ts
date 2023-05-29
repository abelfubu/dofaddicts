export class MathUtils {
  static calculatePercentage(current: number, total: number): number {
    return Number((current / total) * 100) || 0.001;
  }
}
