import React, { useState, useEffect, useRef } from 'react';
import {
  InfoCard,
} from '@backstage/core-components';
import { Box, Grid } from '@material-ui/core';

import { RecoverTime, ChangeFailureRate, ChangeLeadTime, DeploymentFrequency, ScoreBoard, fetchData } from 'liatrio-react-dora';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { genAuthHeaderValueLookup, getRepoName } from '../helper';
import DateRangePicker from './DateRangePicker';

export const Charts = () => {
  const entity = useEntity();
  const configApi = useApi(configApiRef);
  const backendUrl = configApi.getString('backend.baseUrl');
  const endpoint = configApi.getString("dora.endpoint");

  const getAuthHeaderValue = genAuthHeaderValueLookup()
  
  const apiUrl = `${backendUrl}/api/proxy/dora/api/${endpoint}`

  const [repoName, setRepoName] = useState<string>("")
  const [data, setData] = useState<any>()
  const startDate = useRef<Date>(new Date((new Date()).getTime() - 30 * 24 * 60 * 60 * 1000))
  const endDate = useRef<Date>(new Date())

  const updateDateRange = async (start: Date, end: Date) => {
    if(start.getTime() !== startDate.current.getTime() || end.getTime() !== endDate.current.getTime()) {
      await fetchData({
        api: apiUrl,
        getAuthHeaderValue: getAuthHeaderValue,
        repositories: [repoName],
        start: start,
        end: end,
      }, (data: any) => {
        setData(data)
      })
    }
    
    startDate.current = start
    endDate.current = end
  }

  useEffect(() => {
    const repoName = getRepoName(entity)
    setRepoName(repoName)

    let fetch = async () => {
      fetchData({
        api: apiUrl,
        getAuthHeaderValue: getAuthHeaderValue,
        repositories: [repoName],
        start: startDate.current,
        end: endDate.current,
      }, (data: any) => {
        setData(data)
      })
    }

    fetch()
  }, [])

  if(repoName === "") {
    return (<div>DORA Metrics are not available for Non-GitHub repos currently</div>)
  }

  return (<>
    <Grid container spacing={3} alignItems="stretch">
      <Grid item md={6} style={{paddingBottom: "25px"}}>
        <InfoCard title="Options">
          <Box position="relative">
            <Box display="flex" justifyContent="flex-end">
              <div style={{ width: '100%', height: '100px' }}>
                <DateRangePicker
                  onChange={updateDateRange}
                  startDate={startDate.current}
                  endDate={endDate.current}
                />
              </div>
            </Box>
          </Box>
        </InfoCard>
      </Grid>
      <Grid item md={6}>
        <InfoCard title="DORA: At a Glance">
          <Box position="relative">
            <Box display="flex" justifyContent="flex-end">
              <div style={{ width: '100%', height: '100px' }}>
                <ScoreBoard data={data} />
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
                <DeploymentFrequency data={data}/>
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
                <ChangeLeadTime data={data}/>
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
                <ChangeFailureRate data={data}/>
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
                <RecoverTime data={data}/>
              </div>
            </Box>
          </Box>
        </InfoCard>
      </Grid>
    </Grid>
  </>)
}
