export interface ChartSlice {
  id: number;
  percent: number;
  color: string;
  label?: string;
  amount?: number;
  current?: number;
  onClickCb?: () => void;
}
