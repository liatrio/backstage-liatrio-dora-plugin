import React from 'react';
import { InfoCard } from '@backstage/core-components';
import { Box } from '@material-ui/core';
import { DeploymentFrequency as DF } from 'liatrio-react-dora';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { genAuthHeaderValueLookup, getRepoName } from '../helper';

export const DeploymentFrequency = () => {
  const entity = useEntity();
  const configApi = useApi(configApiRef)
  const backendUrl = configApi.getString('backend.baseUrl')
  const endpoint = configApi.getString("dora.deploymentFrequencyEndpoint")

  const getAuthHeaderValue = genAuthHeaderValueLookup()

  const apiUrl = `${backendUrl}/api/proxy/dora/api/${endpoint}`
  const repoName = getRepoName(entity)

  return (
    <InfoCard title="Deployment Frequency">
      <Box position="relative">
        <Box display="flex" justifyContent="flex-end">
          <div style={{ width: '800px', height: '400px' }}>
            { repoName === "" ?
              <div>DORA Metrics are not available for Non-GitHub repos currently</div>
            :
              <DF
                api={apiUrl}
                getAuthHeaderValue={getAuthHeaderValue}
                repositories={[repoName]}
              />
            }
          </div>
        </Box>
      </Box>
    </InfoCard>
  );
};
