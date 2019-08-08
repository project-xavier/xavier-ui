import React, { Fragment, Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
    Main,
    PageHeader,
    PageHeaderTitle,
    Skeleton
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
import { REPORT_VIEW_PATHS } from '../../pages/ReportView/ReportViewConstants';
import { ObjectFetchStatus } from '../../models/state';

export interface Props extends RouterGlobalProps {
    mainStyle?: any;
    report: Report | null;
    reportFetchStatus: ObjectFetchStatus;
};

interface State {
    activeTabKey: number | string;
}

class ReportViewPage extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        let activeTabKey = 0;

        if (props.location.pathname.endsWith(REPORT_VIEW_PATHS.initialSavingsEstimation)) {
            activeTabKey = 0;
        } else if (props.location.pathname.endsWith(REPORT_VIEW_PATHS.initialSavingsEstimation)) {
            activeTabKey = 1;
        } else if (props.location.pathname.endsWith(REPORT_VIEW_PATHS.workloadInventory)) {
            activeTabKey = 2;
        }

        this.state = {
            activeTabKey
        };
    }

    public handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: number | string) => {
        this.setState({
            activeTabKey: tabIndex
        });

        const { history, match } = this.props;

        switch (tabIndex) {
            case 0:
                history.push(`${match.url}/${REPORT_VIEW_PATHS.initialSavingsEstimation}`);
                break;
            case 1:
                history.push(`${match.url}/${REPORT_VIEW_PATHS.workloadMigrationSummary}`);
                break;
            case 2:
                history.push(`${match.url}/${REPORT_VIEW_PATHS.workloadInventory}`);
                break;
        }
    };

    public renderTabs = () => {
        const { report } = this.props;
        const currentBreadcrumb = report ? report.reportName : '';

        return (
            <React.Fragment>
                <Breadcrumb style={ { marginBottom: '25px' } }>
                    <BreadcrumbItem>
                        <Link to="/reports">Reports</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem isActive={true}>{ currentBreadcrumb }</BreadcrumbItem>
                </Breadcrumb>
                <Tabs
                    isFilled={true}
                    onSelect={ this.handleTabClick }
                    activeKey={ this.state.activeTabKey }
                >
                    <Tab eventKey={ 0 } title="Initial savings estimation"/>
                    <Tab eventKey={ 1 } title="Workload migration summary"/>
                    <Tab eventKey={ 2 } title="Workload migration inventory"/>
                </Tabs>
            </React.Fragment>
        );
    }

    public renderTabsSkeleton = () => {
        return (
            <React.Fragment>
                <div className="pf-l-stack pf-m-gutter">
                    <div className="pf-l-stack__item">
                        <Skeleton size="sm" />
                    </div>
                    <div className="pf-l-stack__item">
                        <div className="pf-l-grid">
                            <div className="pf-l-grid__item pf-m-4-col">
                                <Skeleton size="md" />
                            </div>
                            <div className="pf-l-grid__item pf-m-4-col">
                                <Skeleton size="md" />
                            </div>
                            <div className="pf-l-grid__item pf-m-4-col">
                                <Skeleton size="md" />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    };

    public render() {
        const { reportFetchStatus, children } = this.props;

        if (reportFetchStatus.error) {
            return <Redirect to={ `/reports` } />;
        }

        const isFetchComplete: boolean = reportFetchStatus.status === 'complete';

        return (
            <Fragment>
                <PageHeader>
                    <PageHeaderTitle title={ isFetchComplete ? this.renderTabs() : this.renderTabsSkeleton() } />
                </PageHeader>
                <Main style={ this.props.mainStyle }>
                    { isFetchComplete ? children : '' }
                </Main>
            </Fragment>
        );
    }
}

export default ReportViewPage;
