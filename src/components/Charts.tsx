import React, { useState, useEffect } from 'react';
import {
  InfoCard,
} from '@backstage/core-components';
import { Box, Grid } from '@material-ui/core';

import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { RecoverTime, ChangeFailureRate, ChangeLeadTime, DeploymentFrequency, ScoreBoard, fetchData } from 'liatrio-react-dora';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { genAuthHeaderValueLookup, getRepoName } from '../helper';

export const Charts = () => {
  const entity = useEntity();
  const configApi = useApi(configApiRef);
  const backendUrl = configApi.getString('backend.baseUrl');
  const endpoint = configApi.getString("dora.endpoint");

  const getAuthHeaderValue = genAuthHeaderValueLookup()
  
  const apiUrl = `${backendUrl}/api/proxy/dora/api/${endpoint}`

  const [repoName, setRepoName] = useState<string>("")
  const [data, setData] = useState<any>()
  const [dateRange, setDateRange] = useState<any>({
    startDate: new Date((new Date()).getTime() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    key: 'selection',
  })

  const updateDateRange = (range: any) => {
    setDateRange(range.selection)
  }

  useEffect(() => {
    const repoName = getRepoName(entity)
    setRepoName(repoName)

    fetchData({
      api: apiUrl,
      getAuthHeaderValue: getAuthHeaderValue,
      repositories: [repoName],
      start: dateRange.startDate,
      end: dateRange.endDate,
    }, (data: any) => {
      setData(data)
    })
  }, [dateRange])

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
                <DateRange
                  editableDateInputs={true}
                  onChange={updateDateRange}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                />
              </div>
            </Box>
          </Box>
        </InfoCard>
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
