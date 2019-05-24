import { Route, Switch, Redirect } from 'react-router-dom';
import React from 'react';
import asyncComponent from './Utilities/asyncComponent';
import some from 'lodash/some';
import { GlobalProps } from './models/GlobalProps';

/**
 * Aysnc imports of components
 *
 * https://webpack.js.org/guides/code-splitting/
 * https://reactjs.org/docs/code-splitting.html
 *
 * pros:
 *      1) code splitting
 *      2) can be used in server-side rendering
 * cons:
 *      1) nameing chunk names adds unnecessary docs to code,
 *         see the difference with DashboardMap and InventoryDeployments.
 *
 */
const DashboardPage = asyncComponent(() =>
    import(/* webpackChunkName: "DashboardPage" */ './PresentationalComponents/DashboardPage/DashboardPage'));
const UploadFiles = asyncComponent(() =>
    import(/* webpackChunkName: "UploadFiles" */ './SmartComponents/UploadFiles/UploadFiles'));
const ReportList = asyncComponent(() =>
    import(/* webpackChunkName: "ReportList" */ './SmartComponents/ReportList/ReportList'));
const ReportView = asyncComponent(() =>
    import(/* webpackChunkName: "ReportView" */ './SmartComponents/ReportView/ReportView'));

const paths = {
    dashboard: '/dashboard',
    upload: '/upload',
    reports: '/reports',
    reportView: '/reports/:reportId'
};

interface InsightsRouteProps {
    component: any;
    rootClass: string;
}

const InsightsRoute = ({ component: Component, rootClass, ...rest } : InsightsRouteProps) => {
    const root = document.getElementById('root');
    if (root) {
        root.removeAttribute('class');
        root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
        root.setAttribute('role', 'main');
    }

    return (<Route { ...rest } component={ Component } />);
};

interface RoutesProps {
    childProps: GlobalProps;
}

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes = (props: RoutesProps) => {
    const path = props.childProps.location.pathname;

    return (
        <Switch>
            <InsightsRoute component={ DashboardPage } rootClass='dashboard' path={ paths.dashboard } />
            <InsightsRoute component={ UploadFiles } rootClass='upload' path={ paths.upload } />
            <InsightsRoute component={ ReportList } rootClass='reports' path={ paths.reports } exact />
            <InsightsRoute component={ ReportView } rootClass='report' path={ paths.reportView } exact />

            { /* Finally, catch all unmatched routes */ }
            <Route render={ () => some(paths, p => p === path) ? null : (<Redirect to={ paths.dashboard } />) } />
        </Switch>
    );
};
