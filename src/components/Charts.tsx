import React, { useState, useEffect } from 'react'
import {
  InfoCard,
} from '@backstage/core-components'
import { Box, Grid } from '@material-ui/core'

import { RecoverTime, ChangeFailureRate, ChangeLeadTime, DeploymentFrequency, ScoreBoard, fetchData } from 'liatrio-react-dora'
import { useEntity } from '@backstage/plugin-catalog-react'
import { useApi, configApiRef } from '@backstage/core-plugin-api'
import { genAuthHeaderValueLookup, getRepoName } from '../helper'

import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

const addDynamicStyles = (className: string, styles: string) => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `.${className} { ${styles} }`;
  document.head.appendChild(styleElement);
};

const getDate = (daysInPast: number) : Date => {
  let date = new Date()

  date.setDate(date.getDate() - daysInPast)

  return date
}

export const Charts = () => {
  const entity = useEntity()
  const configApi = useApi(configApiRef)
  const backendUrl = configApi.getString('backend.baseUrl')
  const endpoint = configApi.getString("dora.endpoint")

  const getAuthHeaderValue = genAuthHeaderValueLookup()
  
  const apiUrl = `${backendUrl}/api/proxy/dora/api/${endpoint}`

  const [repoName, setRepoName] = useState<string>("")
  const [data, setData] = useState<any>()
  const [startDate, setStartDate] = useState<Date>(getDate(31))
  const endDate = getDate(1)
  const [selectedRange, setSelectedRange] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  const ranges: any = [{
    value: 30, label: "Last 30 Days"
  },{
    value: 60, label: "Last 60 Days"
  },{
    value: 90, label: "Last 90 Days"
  },{
    value: 180, label: "Last 180 Days"
  },{
    value: 365, label: "Last 365 Days"
  }]

  const updateDateRange = async ( value: any ) => {
    let newRange = ranges.findIndex((range: { value: number; label: string }) => range.value === value.value)

    if(newRange === selectedRange) {
      return
    } else {
      setSelectedRange(newRange)
    }

    const newStartDate = getDate(value.value)

    setStartDate(newStartDate)
    setLoading(true)
    await fetchData({
        api: apiUrl,
        getAuthHeaderValue: getAuthHeaderValue,
        repositories: [repoName],
        start: newStartDate,
        end: endDate,
      }, (data: any) => {
        setData(data)
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

  return (<>
    <Grid container style={{marginBottom: "10px"}} spacing={3} alignItems="stretch">
      <Grid item md={6} style={{paddingBottom: "25px", overflow: "visible"}}>
        <InfoCard title="Options" className="doraOptions">
          <Box overflow="visible" position="relative">
            <Box overflow="visible" display="flex" justifyContent="center" alignItems="center">
              <label style={{paddingRight: "10px"}}>Select Days in past to view:</label><Dropdown options={ranges} onChange={updateDateRange} value={ranges[selectedRange]} />
            </Box>
          </Box>
        </InfoCard>
      </Grid>
      <Grid item md={6}>
        <InfoCard title="DORA: At a Glance">
          <Box position="relative">
            <Box display="flex" justifyContent="flex-end">
              <div style={{ width: '100%', height: '100px' }}>
                <ScoreBoard data={data} loading={loading}/>
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
                <DeploymentFrequency data={data} loading={loading}/>
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
                <ChangeLeadTime data={data} loading={loading}/>
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
                <ChangeFailureRate data={data} loading={loading}/>
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
                <RecoverTime data={data} loading={loading}/>
              </div>
            </Box>
          </Box>
        </InfoCard>
      </Grid>
    </Grid>
  </>)
}
