import React, { Fragment, Component } from 'react';

import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';
import {
    Tabs,
    Tab
} from '@patternfly/react-core';

interface Props {
    mainStyle?: any;
    reportId: number;

    match: any;
    history: any;
};

interface State {
    activeTabKey: number
}

export class ReportViewPage extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            activeTabKey: 0
        };
    }

    handleTabClick = (event: any, tabIndex: number) => {
        this.setState({
            activeTabKey: tabIndex
        });
        switch (tabIndex) {
            case 0:
                this.props.history.push(`${this.props.match.url}/workloadMigrationSummary`);
                break;
            case 1:
                this.props.history.push(`${this.props.match.url}/initialSavingsEstimation`);
                break;
            case 2:
                this.props.history.push(`${this.props.match.url}/workloadInventory`);
                break;
        }
    };

    tabs = () => {
        return (
            <Tabs isFilled activeKey={ this.state.activeTabKey } onSelect={ this.handleTabClick }>
                <Tab eventKey={ 0 } title="Workload Migration Summary"></Tab>
                <Tab eventKey={ 1 } title="Initials Savings Estimation"></Tab>
                <Tab eventKey={ 2 } title="Workload Inventory"></Tab>
            </Tabs>
        );
    }

    render() {
        const { children } = this.props;

        return (
            <Fragment>
                { <PageHeader>
                    <PageHeaderTitle title={ 'Reports' } />
                </PageHeader> }
                <Main style={ this.props.mainStyle }>
                    { children }
                </Main>
            </Fragment>
        );
    }
};

export default ReportViewPage;
