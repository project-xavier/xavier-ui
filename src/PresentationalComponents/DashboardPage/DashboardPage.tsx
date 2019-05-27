import React from 'react';
import { withRouter } from 'react-router-dom';
import asyncComponent from '../../Utilities/asyncComponent';
import './DashboardPage.scss';
import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';
import { GlobalProps } from '../../models/GlobalProps';

const EmptyDashboard = asyncComponent(() => import('../EmptyDashboard/EmptyDashboard'));

interface Props extends GlobalProps {
}

interface State {
}

class DashboardPage extends React.Component<Props, State> {

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

export default withRouter(DashboardPage);
