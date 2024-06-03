import React from 'react';
import {
  InfoCard,
} from '@backstage/core-components';
import { Box } from '@material-ui/core';
import { ChangeLeadTime as CLT } from 'liatrio-react-dora';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, configApiRef, identityApiRef } from '@backstage/core-plugin-api';

export const ChangeLeadTime = () => {
  const entity = useEntity();
  const configApi = useApi(configApiRef);
  const identityApi = useApi(identityApiRef)
  const backendUrl = configApi.getString('backend.baseUrl');
  const endpoint = configApi.getString("dora.changeLeadTimeEndpoint");

  const getAuthHeaderValue = async() => {
    const obj = await identityApi.getCredentials()

    if(obj.token) {
      return `Bearer ${obj.token}`
    } else {
      return undefined
    }
  }

  const apiUrl = `${backendUrl}/api/proxy/dora/api/${endpoint}`

  return (
    <InfoCard title="Change Lead Time">
      <Box position="relative">
        <Box display="flex" justifyContent="flex-end">
          <div style={{ width: '800px', height: '400px' }}>
            <CLT
              api={apiUrl}
              getAuthHeaderValue={getAuthHeaderValue}
              repositories={[entity.entity.metadata.name]}
            />
          </div>
        </Box>
      </Box>
    </InfoCard>
  );
};
