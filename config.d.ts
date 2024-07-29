export interface Config {
  /**
   * Frontend root URL
   * NOTE: Visibility applies to only this field
   * @deepVisibility frontend
   */
  dora: {
    endpoint: string
    showWeekends: boolean
    includeWeekends: boolean
    showDetails: boolean
  };
}