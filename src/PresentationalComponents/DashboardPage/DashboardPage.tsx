import React from 'react';
import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';
import EmptyDashboard from '../EmptyDashboard/EmptyDashboard';

const DashboardPage = () => {
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
};

export default DashboardPage;
