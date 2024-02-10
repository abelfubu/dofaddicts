export class HarvestSteps {
  static generate(steps: number): boolean[] {
    return [...new Array(steps)].map(() => true);
  }

  static mapToFormGroup(steps: boolean[]): Record<number, [boolean]> {
    return steps.reduce<Record<number, [boolean]>>((acc, value, index) => {
      acc[index + 1] = [value];
      return acc;
    }, {});
  }

  static mapToFormValue(
    steps: boolean[],
    value: boolean,
  ): Record<number, boolean> {
    return steps.reduce<Record<number, boolean>>((acc, _value, index) => {
      acc[index + 1] = value;
      return acc;
    }, {});
  }

  static mapToSelectOptions(
    steps: boolean[],
  ): { label: string; value: string }[] {
    return steps.map((_, index) => ({
      label: `Etapa ${index + 1}`,
      value: `Etapa ${index + 1}`,
    }));
  }
}
