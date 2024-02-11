export class StringUtils {
  static normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase();
  }

  static filterList<T>(
    list: T[],
    filter: string,
    callback: (item: T) => string,
  ): T[] {
    return list.filter((item) =>
      this.normalize(callback(item)).includes(this.normalize(filter)),
    );
  }
}
