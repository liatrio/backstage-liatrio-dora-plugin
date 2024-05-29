import React, { useEffect, useState } from 'react';
import { InfoCard } from '@backstage/core-components';
import { Box, CircularProgress } from '@material-ui/core';
import { DeploymentFrequency } from 'liatrio-react-dora';

export const DeploymentFrequencyComponent = () => {
  // const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //   const fetchData = async () => {
    //     const response = await fetch('https://api.example.com/data');
    //     const result = await response.json();
    //     setData(result);
    //     setLoading(false);
    //   };

    //   fetchData();
    setLoading(false);
  }, []);

  // if (loading) {
  //   return <CircularProgress />;
  // }

  return (
    <InfoCard title="Deployment Frequency">
      {loading ? (
        <CircularProgress />
      ) : (
        <Box position="relative">
          <Box display="flex" justifyContent="flex-end">
            <div style={{ width: '800px', height: '400px' }}>
              <DeploymentFrequency
                api=""
                data='[
                    {"created_at": "2024-05-15T14:41:39Z", "environment": "dev", "updated_at": "2024-05-15T14:42:21Z", "state": "success", "repository": "dora-deploy-demo"},
                    {"created_at": "2024-05-15T14:02:14Z", "environment": "development", "updated_at": "2024-05-15T14:02:27Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-15T13:59:08Z", "environment": "development", "updated_at": "2024-05-15T14:02:14Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-15T13:57:36Z", "environment": "development", "updated_at": "2024-05-15T13:57:49Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-15T13:46:38Z", "environment": "production", "updated_at": "2024-05-15T13:48:08Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-15T13:42:54Z", "environment": "production", "updated_at": "2024-05-15T13:44:48Z", "state": "failure", "repository": "clockwork"},
                    {"created_at": "2024-05-15T11:00:47Z", "environment": "production", "updated_at": "2024-05-15T11:01:41Z", "state": "failure", "repository": "clockwork"},
                    {"created_at": "2024-05-15T01:05:31Z", "environment": "github-pages", "updated_at": "2024-05-15T01:05:54Z", "state": "success", "repository": "dojo-portal"},
                    {"created_at": "2024-05-15T00:00:50Z", "environment": "development", "updated_at": "2024-05-15T00:01:00Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-14T23:58:01Z", "environment": "development", "updated_at": "2024-05-15T00:00:50Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-14T23:56:38Z", "environment": "development", "updated_at": "2024-05-14T23:56:47Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-14T23:48:41Z", "environment": "development", "updated_at": "2024-05-14T23:50:27Z", "state": "failure", "repository": "clockwork"},
                    {"created_at": "2024-05-14T23:47:11Z", "environment": "development", "updated_at": "2024-05-14T23:47:21Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-14T23:22:48Z", "environment": "development", "updated_at": "2024-05-14T23:22:59Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-14T20:05:53Z", "environment": "github-pages", "updated_at": "2024-05-14T20:06:12Z", "state": "success", "repository": "liatrio-intranet"},
                    {"created_at": "2024-05-14T16:37:05Z", "environment": "development", "updated_at": "2024-05-14T16:37:18Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-14T11:00:43Z", "environment": "production", "updated_at": "2024-05-14T11:02:17Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-13T17:58:11Z", "environment": "*", "updated_at": "2024-05-13T17:58:44Z", "state": "success", "repository": "flywheel-infrastructure-aws-sc-portfolio-shared-products"},
                    {"created_at": "2024-05-13T17:58:09Z", "environment": "*", "updated_at": "2024-05-13T17:58:43Z", "state": "success", "repository": "flywheel-infrastructure-aws-sc-portfolio-shared-products"},
                    {"created_at": "2024-05-13T17:58:06Z", "environment": "*", "updated_at": "2024-05-13T17:58:29Z", "state": "success", "repository": "flywheel-infrastructure-aws-sc-portfolio-shared-products"},
                    {"created_at": "2024-05-13T17:57:35Z", "environment": "*", "updated_at": "2024-05-13T17:58:00Z", "state": "success", "repository": "flywheel-infrastructure-aws-sc-portfolio-shared-products"},
                    {"created_at": "2024-05-13T16:59:14Z", "environment": "github-pages", "updated_at": "2024-05-13T16:59:34Z", "state": "success", "repository": "liatrio-intranet"},
                    {"created_at": "2024-05-13T16:54:12Z", "environment": "github-pages", "updated_at": "2024-05-13T16:54:32Z", "state": "success", "repository": "liatrio-intranet"},
                    {"created_at": "2024-05-13T16:10:49Z", "environment": "production", "updated_at": "2024-05-13T16:14:26Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-13T16:10:27Z", "environment": "development", "updated_at": "2024-05-13T16:10:37Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-13T16:08:51Z", "environment": "development", "updated_at": "2024-05-13T16:10:27Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-13T16:07:27Z", "environment": "development", "updated_at": "2024-05-13T16:07:40Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-13T15:41:13Z", "environment": "nonprod", "updated_at": "2024-05-13T15:42:43Z", "state": "success", "repository": "gratibot"},
                    {"created_at": "2024-05-13T14:35:05Z", "environment": "development", "updated_at": "2024-05-13T14:35:14Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-13T13:11:44Z", "environment": "production", "updated_at": "2024-05-13T13:14:59Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-05-13T11:02:09Z", "environment": "production", "updated_at": "2024-05-13T11:04:31Z", "state": "success", "repository": "harvester"},
                    {"created_at": "2024-05-13T11:00:41Z", "environment": "production", "updated_at": "2024-05-13T11:01:44Z", "state": "success", "repository": "clockwork"},
                    {"created_at": "2024-04-12T20:02:20Z", "environment": "dev", "updated_at": "2024-05-12T20:02:21Z", "state": "failure", "repository": "flywheel-infrastructure-aws-sc-portfolio-vpc"}
                  ]'
              />
            </div>
          </Box>
        </Box>
      )}
    </InfoCard>
  );
};

// export default ChangeLeadTimeComponent;
