import React from 'react';
import {
  InfoCard,
} from '@backstage/core-components';
import { Box } from '@material-ui/core';
import { ChangeFailureRate as CFR } from 'liatrio-react-dora';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, configApiRef, identityApiRef } from '@backstage/core-plugin-api';

const getRepoName = (e: any) => {
  if ('github.com/project-slug' in e.entity.metadata.annotations) {
    return e.entity.metadata.annotations['github.com/project-slug'].split('/')[1]
  } else {
    return ""
  }
}

export const ChangeFailureRate = () => {
  const entity = useEntity();
  const configApi = useApi(configApiRef);
  const identityApi = useApi(identityApiRef)
  const backendUrl = configApi.getString('backend.baseUrl');
  const endpoint = configApi.getString("dora.changeFailureRateEndpoint");

  const getAuthHeaderValue = async() => {
    const obj = await identityApi.getCredentials()

    if(obj.token) {
      return `Bearer ${obj.token}`
    } else {
      return undefined
    }
  }
  
  const repoName = getRepoName(entity)
  const apiUrl = `${backendUrl}/api/proxy/dora/api/${endpoint}`

  return (
    <InfoCard title="Change Lead Time">
      <Box position="relative">
        <Box display="flex" justifyContent="flex-end">
          <div style={{ width: '800px', height: '400px' }}>
            { repoName === "" ?
              <div>DORA Metrics are not available for Non-GitHub repos currently</div>
            : 
              <CFR
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
