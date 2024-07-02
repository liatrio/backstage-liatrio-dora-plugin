import React from 'react';
import {
  InfoCard,
} from '@backstage/core-components';
import { Box } from '@material-ui/core';
import { ScoreBoard as SB } from 'liatrio-react-dora';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { genAuthHeaderValueLookup, getRepoName } from '../helper';

export const ScoreBoard = () => {
  const entity = useEntity();
  const configApi = useApi(configApiRef);
  const backendUrl = configApi.getString('backend.baseUrl');
  const endpoint = configApi.getString("dora.endpoint");

  const getAuthHeaderValue = genAuthHeaderValueLookup()
  
  const repoName = getRepoName(entity)
  const apiUrl = `${backendUrl}/api/proxy/dora/api/${endpoint}`

  return (
    <InfoCard title="DORA: 30 Days At a Glance">
      <Box position="relative">
        <Box display="flex" justifyContent="flex-end">
          <div style={{ width: '100%', height: '100px' }}>
            { repoName === "" ?
              <div>DORA Metrics are not available for Non-GitHub repos currently</div>
            : 
              <SB
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
