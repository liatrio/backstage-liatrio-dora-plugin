import {
  createComponentExtension,
  createPlugin,
  createRouteRef,
} from '@backstage/core-plugin-api';

export const entityContentRouteRef = createRouteRef({
  id: 'dora-metrics',
});

export const DORAMetricsPlugin = createPlugin({
  id: 'dora-metrics',
  routes: {
    entityContent: entityContentRouteRef,
  },
});

export const EntityDORAChangeLeadTimeCard = DORAMetricsPlugin.provide(
  createComponentExtension({
    name: 'EntityDORAChangeLeadTimeCard',
    component: {
      lazy: () =>
        import('./components/ChangeLeadTime').then(
          m => m.ChangeLeadTime,
        ),
    },
  }),
);

export const EntityDORADeploymentFrequency = DORAMetricsPlugin.provide(
  createComponentExtension({
    name: 'EntityDORADeploymentFrequency',
    component: {
      lazy: () =>
        import('./components/DeploymentFrequency').then(
          m => m.DeploymentFrequency,
        ),
    },
  }),
);
