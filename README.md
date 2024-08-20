# Introduction

This is a plugin for the [BackStage](https://backstage.io/) Project that provides a seamless way to display DORA Metrics in your developer portals.

Our goal is to provide an Open Source plugin that works with the Open Telemetry backend collecting your DORA metrics in a non-opinionated manner.

**This plugin is currently losely tied to GitHub and Loki DB, we plan to expand to GitLab and other platforms in the future**

# Components

* DORA Score Board - This is a DORA Score Board for the last 30 days that appears in your Component entries Overview Tab
* DORA Charts - This is a set of charts that for the DORA metrics.  It has the option of showing an individual components metrics, or an entire teams metrics

# Dependencies

This plugin relies on the following dependencies:

* [Liatrio DORA API](https://github.com/liatrio/liatrio-dora-api)
* [Liatrio DORA React Components](https://github.com/liatrio/liatrio-react-dora)
* [Liatrio Otel Collector](https://github.com/liatrio/liatrio-otel-collector)
* An instance of Loki DB
  * **You can swap out for any Time Series DB, but you will need to fork and modify the `Liatrio DORA API` to do so**
* A GitHub Organization hosting your repositories
  * **We will expand this to more platforms in the future**

# Installation of Dependencies

**TODO**

# Installation into BackStage

To Install this plugin you'll need to do the following:

1. Install the `backstage-plugin-liatrio-dora` package into the `/packages/app` folder

    ```
	npm install https://github.com/liatrio/backstage-liatrio-dora-plugin/releases/download/v0.3.14/liatrio-backstage-plugin-liatrio-dora-v0.3.14.tgz

	yarn add backstage-liatrio-dora-plugin@https://github.com/liatrio/backstage-liatrio-dora-plugin/releases/download/v0.3.14/liatrio-backstage-plugin-liatrio-dora-v0.3.14.tgz
	```

2. Update the `/packages/app/src/App.tsx` file:
    * Add this to your imports:
	```
	import { EntityDORACharts } from '@liatrio/backstage-plugin-liatrio-dora';
	```

	* Add this into the `FlatRoutes` element as a child:
	```
	<Route path="/dora" element={<EntityDORACharts showTeamSelection />} />
	```

3. Update the `/packages/app/src/components/catalog/EntityPage.tsx` file:
    * Add this to your imports:
	```
	import {
		EntityDORACharts,
		EntityDORAScoreBoard,
	} from '@liatrio/backstage-plugin-liatrio-dora';
	```

	* Define this constant:
	```
	const doraContent = (
		<Grid container spacing={3} alignItems="stretch">
			{entityWarningContent}
			<EntityDORACharts showTeamSelection={false} />
		</Grid>
	);
	```

	* Add this into the `serviceEntityPage`, `websiteEntityPage`, `defaultEntityPage` `EntityLayoutWrapper` elements:
	```
	<EntityLayout.Route path="/dora" title="DORA">
      {doraContent}
    </EntityLayout.Route>
	```

	* Add this into the `overviewContent` `Grid`:
	```
	<Grid item md={6}>
      <EntityDORAScoreBoard />
    </Grid>
	```

4. Update the `app-config.yaml`:
    * Add this to the `proxy.endpoints`:
	```
	/dora/api:
      target: [URL_TO_DORA_API]
	```

    * Add this root property `dora` to the file and then add the following under it:
		* Required:
			* `dataEndpoint`: This the endpoint on the proxy that provides the deployment data.  If you are using the `liatrio-dora-api` this will be `data`
			* `teamListEndpiont`: This the endpoint on the proxy that provides the team and repo owndership data.  If you are using the `liatrio-dora-api` this will be `teams`
		* Optional:
			* `showWeekends`: This boolean will toggle the `Deployment Frequency Chart` to hide weekends or show them.  The default is to hide them.
			* `includeWeekends`: This boolean will toggle whether weekends are included in scoring your `Deployment Frequency` and `Change Lead Time`.  The default is to exclude them.
			* `showDetails`: This boolean will toggle whether or not the `DORA Score Board` shows the exact scores on hover or as static text.  The default is to show them on hover.
			* `rankThresholds`: This is an object to override the default rank thresholds for DORA Score Board and is fully optional all the way down to the individual ranks.

		      There are 4 scores, all are optional:
			  * `deployment_frequency` measured in hours
			  * `change_lead_time` measured in hours
			  * `change_failure_rate` measured as a percentage
			  * `recover_time` measured in hours

			  Each score has the following rank options:
			  * `elite`
			  * `high`
			  * `medium`

			  **Note: Anything outside `medium` is considered `low`**

			  The default rank thresholds are:
			  * deployment_frequency
			  	* elite: 24 (1 day or less)
				* high: 168 (1 week or less)
				* medium: 720 (1 month or less)
			  * change_lead_time
			  	* elite: 24 (1 day or less)
				* high: 168 (1 week or less)
				* medium: 720 (1 month or less)
			  * change_failure_rate
			  	* elite: 5
				* high: 10
				* medium: 45
			  * recover_time
			  	* elite: 1 (1 hr or less)
				* high: 24 (1 day or less)
				* medium: 168 (1 week or less)
