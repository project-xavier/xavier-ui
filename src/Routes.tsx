import { Route, Switch, Redirect } from 'react-router-dom';
import React from 'react';
import asyncComponent from './Utilities/asyncComponent';
import some from 'lodash/some';
import { RouterGlobalProps } from './models/router';

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
const Reports = asyncComponent(() =>
    import(/* webpackChunkName: "Reports" */ './pages/Reports'));
const ReportsUpload = asyncComponent(() =>
    import(/* webpackChunkName: "ReportsUpload" */ './pages/ReportsUpload'));
const ReportView = asyncComponent(() =>
    import(/* webpackChunkName: "ReportView" */ './pages/ReportView'));

const paths = {
    reports: '/reports',
    reportsUpload: '/reports/upload',
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
    childProps: RouterGlobalProps;
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
            <InsightsRoute component={ Reports } rootClass='reports' path={ paths.reports } exact />
            <InsightsRoute component={ ReportsUpload } rootClass='reports' path={ paths.reportsUpload } />
            <InsightsRoute component={ ReportView } rootClass='report' path={ paths.reportView } />

            { /* Finally, catch all unmatched routes */ }
            <Route render={ () => some(paths, p => p === path) ? null : (<Redirect to={ paths.reports } />) } />
        </Switch>
    );
};
