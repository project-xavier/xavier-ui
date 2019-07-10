import React, { Fragment, Component } from 'react';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';
import {
    Tabs,
    Tab,
    Breadcrumb,
    BreadcrumbItem
} from '@patternfly/react-core';
import { Report } from '../../models';
import { Link } from 'react-router-dom';
import { RouterGlobalProps } from '../../models/router';

interface Props extends RouterGlobalProps {
    mainStyle?: any;
    report: Report;
    loading: boolean;
    error: string;

    match: any;
    history: any;
};

interface State {
    activeTabKey: number
}

class ReportViewPage extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        let activeTabKey = 1; // TODO Change this when other tabs are implemented

        if (props.location.pathname.endsWith('workloadMigrationSummary')) {
            activeTabKey = 0;
        } else if (props.location.pathname.endsWith('initialSavingsEstimation')) {
            activeTabKey = 1;
        } else if (props.location.pathname.endsWith('workloadInventory')) {
            activeTabKey = 2;
        }

        this.state = {
            activeTabKey
        };
    }

    handleTabClick = (event: any, tabIndex: number) => {
        this.setState({
            activeTabKey: tabIndex
        });

        const { history, match } = this.props;

        switch (tabIndex) {
            case 0:
                history.push(`${match.url}/workloadMigrationSummary`);
                break;
            case 1:
                history.push(`${match.url}/initialSavingsEstimation`);
                break;
            case 2:
                history.push(`${match.url}/workloadInventory`);
                break;
        }
    };

    renderTabs = () => {
        const { report } = this.props;
        const currentBreadcrumb = report ? report.fileName : '';

        return (
            <React.Fragment>
                <Breadcrumb style={ { marginBottom: '25px' } }>
                    <BreadcrumbItem>
                        <Link to="/reports">Reports</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem isActive>{ currentBreadcrumb }</BreadcrumbItem>
                </Breadcrumb>
                <Tabs
                    isFilled
                    activeKey={ this.state.activeTabKey }
                    onSelect={ this.handleTabClick }
                >
                    <Tab eventKey={ 0 } title="Workload Migration Summary"></Tab>
                    <Tab eventKey={ 1 } title="Initials Savings Estimation"></Tab>
                    <Tab eventKey={ 2 } title="Workload Inventory"></Tab>
                </Tabs>
            </React.Fragment>
        );
    }

    render() {
        const { report, children } = this.props;

        return (
            <Fragment>
                <PageHeader>
                    <PageHeaderTitle title={ report ? this.renderTabs() : '' } />
                </PageHeader>
                <Main style={ this.props.mainStyle }>
                    { report ? children : '' }
                </Main>
            </Fragment>
        );
    }
};

export default ReportViewPage;
