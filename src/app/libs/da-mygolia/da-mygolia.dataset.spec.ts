import { DhMygoliaDataset, DhMygoliaValidatorFn } from './da-mygolia.dataset';

interface Animal {
  id: string;
  name: string;
  description: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

const dataSet: Animal[] = [
  {
    id: '1',
    name: 'test',
    description: 'test',
    type: 'cat',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'test2',
    description: 'test2',
    type: 'cat',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'test3',
    description: 'test3',
    type: 'dog',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'test4',
    description: 'test4',
    type: 'dog',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'test5',
    description: 'test5',
    type: 'dog',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'test6',
    description: 'test6',
    type: 'dog',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const validators: DhMygoliaValidatorFn<Animal>[] = [
  (item: Animal, filters: any) => {
    if (filters.type && item.type !== filters.type) {
      throw new Error('Invalid type');
    }
  },
];

describe(DhMygoliaDataset.name, () => {
  let dataset: DhMygoliaDataset<Animal>;

  beforeEach(() => {
    dataset = new DhMygoliaDataset({ validators, maxResults: 3 });
  });

  it('should create an instance', () => {
    expect(dataset).toBeTruthy();
  });

  it('should return the correct number of pages', () => {
    expect(dataset.getDataSet(dataSet, { type: 'dog' }).next).toBe(1);
  });

  it('should return a correct second page with one item', () => {
    expect(dataset.getDataSet(dataSet, { type: 'dog' }, 1).dataSet.length).toBe(
      1
    );
  });

  it('should return the correct number of cats', () => {
    expect(dataset.getDataSet(dataSet, { type: 'cat' }, 0).dataSet.length).toBe(
      2
    );
  });

  it('should return an empty dataset for no matches', () => {
    expect(
      dataset.getDataSet(dataSet, { type: 'tiger' }, 0).dataSet.length
    ).toBe(0);
  });
});
