/**
 * Dashboard Types enum
 * Converted from Java to TypeScript for Playwright
 * Maintains the same structure and logic as the source Java enum
 */
export class DashboardTypes {
  private readonly _value: string;
  private readonly _listIndex: number;

  private constructor(value: string, listIndex: number) {
    this._value = value;
    this._listIndex = listIndex;
  }

  public getValue(): string {
    return this._value;
  }

  public getListIndex(): number {
    return this._listIndex;
  }

  // Static enum instances matching the Java enum exactly
  static readonly ESSENTIALS = new DashboardTypes("Student Analytics", 0);
  static readonly CLASSROOM = new DashboardTypes("Classroom", 1);
  static readonly RISK_ANALYSIS = new DashboardTypes("Risk Analysis", 2);
  static readonly USAGE = new DashboardTypes("Usage", 3);
  static readonly STUDENTREADINESS = new DashboardTypes("Student Readiness Analytics", 4);
  static readonly INTERVENTIONS = new DashboardTypes("Interventions", 5);
  static readonly TALENT = new DashboardTypes("Talent", 6);
  static readonly STUDENTPLANS = new DashboardTypes("Student Plans", 7);
  static readonly STUDENTANALYTICS = new DashboardTypes("Student Analytics", 0);

  // Additional utility methods for TypeScript usage
  static getAllValues(): DashboardTypes[] {
    return [
      this.ESSENTIALS,
      this.CLASSROOM,
      this.RISK_ANALYSIS,
      this.USAGE,
      this.STUDENTREADINESS,
      this.INTERVENTIONS,
      this.TALENT,
      this.STUDENTPLANS,
      this.STUDENTANALYTICS
    ];
  }

  static getByListIndex(index: number): DashboardTypes | undefined {
    return this.getAllValues().find(type => type.getListIndex() === index);
  }

  static getByValue(value: string): DashboardTypes | undefined {
    return this.getAllValues().find(type => type.getValue() === value);
  }

  toString(): string {
    return this._value;
  }
}
