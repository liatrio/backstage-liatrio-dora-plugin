import React, { useState, useEffect } from 'react';
import {
  InfoCard,
} from '@backstage/core-components';
import { Box } from '@material-ui/core';
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

  useEffect(() => {
    const repoName = getRepoName(entity)
    setRepoName(repoName)

    fetchData({
      api: apiUrl,
      getAuthHeaderValue: getAuthHeaderValue,
      repositories: [repoName]
    }, (data: any) => {
      setData(data)
    })
  }, [])

  if(repoName === "") {
    return (<div>DORA Metrics are not available for Non-GitHub repos currently</div>)
  }

  return (
    <div>
      <ScoreBoard data={data} />
      <InfoCard title="Deployment Frequency">
        <Box position="relative">
          <Box display="flex" justifyContent="flex-end">
            <div style={{ width: '800px', height: '400px' }}>
              <DeploymentFrequency data={data}/>
            </div>
          </Box>
        </Box>
      </InfoCard>
      <InfoCard title="Change Lead Time">
        <Box position="relative">
          <Box display="flex" justifyContent="flex-end">
            <div style={{ width: '800px', height: '400px' }}>
              <ChangeLeadTime data={data}/>
            </div>
          </Box>
        </Box>
      </InfoCard>
      <InfoCard title="Change Failure Rate">
        <Box position="relative">
          <Box display="flex" justifyContent="flex-end">
            <div style={{ width: '800px', height: '400px' }}>
              <ChangeFailureRate data={data}/>
            </div>
          </Box>
        </Box>
      </InfoCard>
      <InfoCard title="Recover Time">
        <Box position="relative">
          <Box display="flex" justifyContent="flex-end">
            <div style={{ width: '800px', height: '400px' }}>
              <RecoverTime data={data}/>
            </div>
          </Box>
        </Box>
      </InfoCard>
    </div>
  )
}