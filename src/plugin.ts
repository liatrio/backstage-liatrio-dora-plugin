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

export const EntityDORAScoreBoard = DORAMetricsPlugin.provide(
  createComponentExtension({
    name: 'EntityDORAScoreBoard',
    component: {
      lazy: () =>
        import('./components/ScoreBoard').then(
          m => m.ScoreBoard,
        ),
    },
  }),
);

export const EntityDORACharts = DORAMetricsPlugin.provide(
  createComponentExtension({
    name: 'EntityDORACharts',
    component: {
      lazy: () =>
        import('./components/Charts').then(
          m => m.Charts,
        ),
    },
  }),
);