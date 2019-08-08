import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import asyncComponent from './Utilities/asyncComponent';
import some from 'lodash/some';
import UserRoute from './SmartComponents/UserRoute';

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
const GettingStarted = asyncComponent(() =>
    import(/* webpackChunkName: "GettingStarted" */ './pages/GettingStarted'));
const Reports = asyncComponent(() =>
    import(/* webpackChunkName: "Reports" */ './pages/Reports'));
const NoReports = asyncComponent(() =>
    import(/* webpackChunkName: "NoReports" */ './pages/NoReports'));
const ReportsUpload = asyncComponent(() =>
    import(/* webpackChunkName: "ReportsUpload" */ './pages/ReportsUpload'));
const ReportView = asyncComponent(() =>
    import(/* webpackChunkName: "ReportView" */ './pages/ReportView'));
const ErrorPage = asyncComponent(() =>
    import(/* webpackChunkName: "ErrorPage" */ './pages/ErrorPage'));

const paths = {
    gettingStarted: '/getting-started',
    reports: '/reports',
    noReports: '/no-reports',
    reportsUpload: '/reports/upload',
    reportView: '/reports/:reportId',
    error: '/error'
};

type Props = {
    childProps: any
};

const InsightsRoute = ({ component: Component, rootClass, skipLoadUser, ...rest }) => {
    const root = document.getElementById('root');
    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
    root.setAttribute('role', 'main');

    if (skipLoadUser) {
        return (<Route { ...rest } component={ Component } />);
    } else {
        return (<UserRoute { ...rest } component={ Component } />);
    }
};

InsightsRoute.propTypes = {
    component: PropTypes.func,
    rootClass: PropTypes.string,
    skipLoadUser: PropTypes.bool
};

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes = (props: Props) => {
    const path = props.childProps.location.pathname;

    return (
        <Switch>
            <InsightsRoute component={ GettingStarted } rootClass='getting-started' path={ paths.gettingStarted } exact />
            <InsightsRoute component={ Reports } rootClass='reports' path={ paths.reports } exact />
            <InsightsRoute component={ NoReports } rootClass='no-reports' path={ paths.noReports } />
            <InsightsRoute component={ ReportsUpload } rootClass='reports-upload' path={ paths.reportsUpload } />
            <InsightsRoute component={ ReportView } rootClass='report-view' path={ paths.reportView } />
            <InsightsRoute component={ ErrorPage } rootClass='error' path={ paths.error } skipLoadUser={ true }/>

            { /* Finally, catch all unmatched routes */ }
            <Route render={ () => some(paths, p => p === path) ? null : (<Redirect to={ paths.gettingStarted }/>) }/>
        </Switch>
    );
};
