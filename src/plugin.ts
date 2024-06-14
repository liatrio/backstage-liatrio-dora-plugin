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

export const EntityDORAChangeFailureRate = DORAMetricsPlugin.provide(
  createComponentExtension({
    name: 'EntityDORAChangeFailureRate',
    component: {
      lazy: () =>
        import('./components/ChangeFailureRate').then(
          m => m.ChangeFailureRate,
        ),
    },
  }),
);

export const EntityDORARecoverTime = DORAMetricsPlugin.provide(
  createComponentExtension({
    name: 'EntityDORARecoverTime',
    component: {
      lazy: () =>
        import('./components/RecoverTime').then(
          m => m.RecoverTime,
        ),
    },
  }),
);