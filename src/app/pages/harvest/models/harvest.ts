export const enum HarvestType {
  MONSTER,
  BOSS,
  ARCHI,
  TOTAL,
}

export interface HarvestTranslation {
  name: string;
  subzone: string;
}

export interface Harvest {
  id: string;
  name: string;
  level: number;
  image: string;
  subzone: string;
  zone: string;
  step: number;
  type: HarvestType;
  captured?: boolean;
  amount?: number;
  es: HarvestTranslation;
  en: HarvestTranslation;
  fr: HarvestTranslation;
  de: HarvestTranslation;
  it: HarvestTranslation;
  pt: HarvestTranslation;
}
