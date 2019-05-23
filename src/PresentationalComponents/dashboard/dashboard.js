import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import asyncComponent from '../../Utilities/asyncComponent';
import './dashboard.scss';

import { Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';

// const SampleComponent = asyncComponent(() => import('../../PresentationalComponents/SampleComponent/sample-component'));
const EmptyDashboard = asyncComponent(() => import('../../SmartComponents/EmptyDashboard/EmptyDashboard'));
// const PageHeader2 = asyncComponent(() => import('../../PresentationalComponents/PageHeader/page-header'));
// const PageHeaderTitle2 = asyncComponent(() => import('../../PresentationalComponents/PageHeader/page-header-title'));

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class Dashboard extends Component {

    render() {
        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='Dashboard' />
                </PageHeader>
                <Main>
                    <EmptyDashboard />
                </Main>
            </React.Fragment>
        );
    }
}

export default withRouter(Dashboard);
