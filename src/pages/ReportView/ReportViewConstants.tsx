import asyncComponent from '../../Utilities/asyncComponent';

const WorkloadMigrationSummary = asyncComponent(() =>
    import(/* webpackChunkName: "WorkloadMigrationSummary" */ './WorkloadMigrationSummary'));
const InitialSavingsEstimation = asyncComponent(() =>
    import(/* webpackChunkName: "InitialSavingsEstimation" */ './InitialSavingsEstimation'));
const WorkloadInventory = asyncComponent(() =>
    import(/* webpackChunkName: "WorkloadInventory" */ './WorkloadInventory'));

export const DEFAULT_VIEW_PATH_INDEX = 0;

export const INITIAL_SAVINGS_ESTIMATION_KEY = 'INITIAL_SAVINGS_ESTIMATION_KEY';
export const WORKLOAD_MIGRATION_SUMMARY_KEY = 'WORKLOAD_MIGRATION_SUMMARY_KEY';
export const WORKLOAD_INVENTORY_KEY = 'WORKLOAD_INVENTORY_KEY';

// The order of this array will determine the order of the tabs
export const REPORT_VIEW_PATHS = [
    {
        key: INITIAL_SAVINGS_ESTIMATION_KEY,
        title: 'Initial savings estimation',
        path: 'initialSavingsEstimation',
        component: InitialSavingsEstimation
    },
    {
        key: WORKLOAD_MIGRATION_SUMMARY_KEY,
        title: 'Workload migration summary',
        path: 'workloadMigrationSummary',
        component: WorkloadMigrationSummary
    },
    {
        key: WORKLOAD_INVENTORY_KEY,
        title: 'Workload migration inventory',
        path: 'workloadInventory',
        component: WorkloadInventory
    }
];
