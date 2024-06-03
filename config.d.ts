export interface Config {
  /**
   * Frontend root URL
   * NOTE: Visibility applies to only this field
   * @deepVisibility frontend
   */
  dora: {
    deploymentFrequencyEndpoint: string
    changeLeadTimeEndpoint: string
    changeFailureRateEndpoint: string
    recoverTimeEndpoint: string
  };
}