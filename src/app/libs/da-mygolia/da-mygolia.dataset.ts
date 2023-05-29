export type DhMygoliaFilters = Record<string, unknown>;

export type DhMygoliaValidatorFn<T> = (
  item: T,
  filters: DhMygoliaFilters,
) => void | Error;

export interface DhMygoliaDatasetConfig<T> {
  maxResults?: number;
  validators?: DhMygoliaValidatorFn<T>[];
}

export interface DhMygoliaResponse<T> {
  dataSet: T[];
  page: number;
  next: number | null;
  previous: number | null;
}

export class DhMygoliaDataset<T> {
  maxResults: number;
  validators: Function[];

  constructor(config: DhMygoliaDatasetConfig<T>) {
    this.maxResults = config.maxResults || 12;
    this.validators = config.validators || [];
  }

  getDataSet(dataset: T[], filters: DhMygoliaFilters, page = 0): DhMygoliaResponse<T> {
    const filtered = this.filterDataset(dataset, filters);
    const next =
      page + 1 < Math.ceil(filtered.length / this.maxResults) ? page + 1 : null;
    const previous = page > 0 ? page - 1 : null;

    return {
      page,
      next,
      previous,
      dataSet: filtered.slice(page * this.maxResults, (page + 1) * this.maxResults),
    };
  }

  private filterDataset(dataset: T[], filters: DhMygoliaFilters): T[] {
    return dataset.reduce<T[]>((acc, item) => {
      try {
        this.validators.forEach((validator) => validator(item, filters));
        acc.push(item);
      } catch {
        void null;
      }

      return acc;
    }, []);
  }
}
