export interface Config {
  /**
   * Frontend root URL
   * NOTE: Visibility applies to only this field
   * @deepVisibility frontend
   */
  dora: {
    dataEndpoint: string
    teamListEndpoint: string
    showWeekends: boolean
    includeWeekends: boolean
    showDetails: boolean
  };
}