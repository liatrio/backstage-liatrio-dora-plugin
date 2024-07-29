import React, { useState, useEffect } from 'react'
import {
  InfoCard,
} from '@backstage/core-components'
import { Box, Grid } from '@material-ui/core'

import { RecoverTime, ChangeFailureRate, ChangeLeadTime, DeploymentFrequency, ScoreBoard, fetchData, getDateDaysInPast } from 'liatrio-react-dora'
import { useEntity } from '@backstage/plugin-catalog-react'
import { useApi, configApiRef } from '@backstage/core-plugin-api'
import { genAuthHeaderValueLookup, getRepoName } from '../helper'

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const addDynamicStyles = (className: string, styles: string) => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `.${className} { ${styles} }`;
  document.head.appendChild(styleElement);
};

export const Charts = () => {
  const entity = useEntity()
  const configApi = useApi(configApiRef)
  const backendUrl = configApi.getString('backend.baseUrl')
  const endpoint = configApi.getString("dora.endpoint")
  const showWeekends = configApi.getOptionalBoolean("dora.showWeekends")
  const includeWeekends = configApi.getOptionalBoolean("dora.includeWeekends")
  const showDetails = configApi.getOptionalBoolean("dora.showDetails")

  const getAuthHeaderValue = genAuthHeaderValueLookup()

  const apiUrl = `${backendUrl}/api/proxy/dora/api/${endpoint}`

  const [repoName, setRepoName] = useState<string>("")
  const [data, setData] = useState<any>()
  const [startDate, setStartDate] = useState<Date>(getDateDaysInPast(31))
  const [endDate, setEndDate] = useState<Date>(getDateDaysInPast(1))
  const [chartStartDate, setChartStartDate] = useState<Date>(getDateDaysInPast(31))
  const [chartEndDate, setChartEndDate] = useState<Date>(getDateDaysInPast(1))
  const [loading, setLoading] = useState<boolean>(true)

  const updateDateRange = async ( dates: [Date, Date] ) => {
    const [newStartDate, newEndDate] = dates;

    setStartDate(newStartDate)
    setEndDate(newEndDate)

    if(!newStartDate || !newEndDate) {
      return
    }

    setLoading(true)

    await fetchData({
        api: apiUrl,
        getAuthHeaderValue: getAuthHeaderValue,
        repositories: [repoName],
        start: newStartDate,
        end: newEndDate,
      }, (data: any) => {
        setData(data)
        setChartStartDate(newStartDate)
        setChartEndDate(newEndDate)
        setLoading(false)
      }, (_) => {
        setLoading(false)
      })
  }

  useEffect(() => {
    const repoName = getRepoName(entity)
    setRepoName(repoName)
    setLoading(true)
    let fetch = async () => {
      fetchData({
        api: apiUrl,
        getAuthHeaderValue: getAuthHeaderValue,
        repositories: [repoName],
        start: startDate,
        end: endDate,
      }, (data: any) => {
        setData(data)
        setLoading(false)
      }, (_) => {
        setLoading(false)
      })
    }

    fetch()
  }, [])

  useEffect(() => {
    // Define your styles as a string
    const styles = `
      overflow: visible;
    `;

    // Add the styles to the document
    addDynamicStyles('doraOptions', styles);
  }, []);

  if(repoName === "") {
    return (<div>DORA Metrics are not available for Non-GitHub repos currently</div>)
  }

  console.log(chartStartDate, chartEndDate)

  return (<>
    <Grid container style={{marginBottom: "10px"}} spacing={3} alignItems="stretch">
      <Grid item md={6} style={{paddingBottom: "25px", overflow: "visible"}}>
        <InfoCard title="Options" className="doraOptions">
          <Box overflow="visible" position="relative">
            <Box overflow="visible" display="flex" justifyContent="center" alignItems="center">
              <label style={{paddingRight: "10px"}}>Select Date Range:</label>
              <DatePicker
                selected={startDate}
                onChange={updateDateRange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
              />
            </Box>
          </Box>
        </InfoCard>
      </Grid>
      <Grid item md={6}>
        <InfoCard title="DORA: At a Glance">
          <Box position="relative">
            <Box display="flex" justifyContent="flex-end">
              <div style={{ width: '100%' }}>
                <ScoreBoard
                  data={data}
                  loading={loading}
                  showDetails={showDetails}
                  showWeekends={showWeekends}
                  includeWeekends={includeWeekends}
                  start={chartStartDate}
                  end={chartEndDate}
                />
              </div>
            </Box>
          </Box>
        </InfoCard>
      </Grid>
    </Grid>
    <Grid container spacing={3} alignItems="stretch">
      <Grid item md={6}>
        <InfoCard title="Deployment Frequency">
          <Box position="relative">
            <Box display="flex" justifyContent="flex-end">
              <div style={{ width: '800px', height: '400px' }}>
                <DeploymentFrequency
                  data={data}
                  loading={loading}
                  showDetails={showDetails}
                  showWeekends={showWeekends}
                  includeWeekends={includeWeekends}
                  start={chartStartDate}
                  end={chartEndDate}
                />
              </div>
            </Box>
          </Box>
        </InfoCard>
      </Grid>
      <Grid item md={6}>
        <InfoCard title="Change Lead Time">
          <Box position="relative">
            <Box display="flex" justifyContent="flex-end">
              <div style={{ width: '800px', height: '400px' }}>
                <ChangeLeadTime
                  data={data}
                  loading={loading}
                  showDetails={showDetails}
                  showWeekends={showWeekends}
                  includeWeekends={includeWeekends}
                  start={chartStartDate}
                  end={chartEndDate}
                />
              </div>
            </Box>
          </Box>
        </InfoCard>
      </Grid>
      <Grid item md={6}>
        <InfoCard title="Change Failure Rate">
          <Box position="relative">
            <Box display="flex" justifyContent="flex-end">
              <div style={{ width: '800px', height: '400px' }}>
                <ChangeFailureRate
                  data={data}
                  loading={loading}
                  showDetails={showDetails}
                  showWeekends={showWeekends}
                  includeWeekends={includeWeekends}
                  start={chartStartDate}
                  end={chartEndDate}
                />
              </div>
            </Box>
          </Box>
        </InfoCard>
      </Grid>
      <Grid item md={6}>
        <InfoCard title="Recover Time">
          <Box position="relative">
            <Box display="flex" justifyContent="flex-end">
              <div style={{ width: '800px', height: '400px' }}>
                <RecoverTime
                  data={data}
                  loading={loading}
                  showDetails={showDetails}
                  showWeekends={showWeekends}
                  includeWeekends={includeWeekends}
                  start={chartStartDate}
                  end={chartEndDate}
                />
              </div>
            </Box>
          </Box>
        </InfoCard>
      </Grid>
    </Grid>
  </>)
}
