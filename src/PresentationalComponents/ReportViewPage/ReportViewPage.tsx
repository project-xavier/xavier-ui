import React, { Fragment, Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
    Tabs,
    Tab,
    Breadcrumb,
    BreadcrumbItem,
    Stack,
    StackItem,
    Grid,
    GridItem
} from '@patternfly/react-core';
import {
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components/components/PageHeader';
import {
    Main
} from '@redhat-cloud-services/frontend-components/components/Main';
import {
    Skeleton
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { Report } from '../../models';
import { RouterGlobalProps } from '../../models/router';
import { ObjectFetchStatus } from '../../models/state';
import { formatDate } from '../../Utilities/formatValue';
import { REPORT_VIEW_PATHS, DEFAULT_VIEW_PATH_INDEX, INITIAL_SAVINGS_ESTIMATION_KEY } from '../../pages/ReportView/ReportViewConstants';

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

        let activeTabKey = DEFAULT_VIEW_PATH_INDEX;

        REPORT_VIEW_PATHS.forEach((val, index) => {
            if (props.location.pathname.endsWith(val.path)) {
                activeTabKey = index;
            }
        });

        this.state = {
            activeTabKey
        };
    }

    public handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: number | string) => {
        this.setState({
            activeTabKey: tabIndex
        });

        const { history, match } = this.props;

        history.push(`${match.url}/${REPORT_VIEW_PATHS[tabIndex].path}`);
    };

    public renderTabs = () => {
        const { report } = this.props;
        const { activeTabKey } = this.state;
        const currentBreadcrumb = report ? report.reportName : '';

        return (
            <React.Fragment>
                <Breadcrumb style={ { marginBottom: '25px' } }>
                    <BreadcrumbItem>
                        <Link to="/reports">Reports</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem isActive={true}>{ currentBreadcrumb }</BreadcrumbItem>
                </Breadcrumb>
                <div className="pf-c-content" style={{marginBottom: 'var(--pf-c-content--MarginBottom)'}}>
                    <p>
                        <span className="pf-c-title pf-m-3xl">{ `${REPORT_VIEW_PATHS[activeTabKey].title} (${ currentBreadcrumb })` }</span>
                    </p>
                    <p>
                        { (report && report.reportDescription) && <React.Fragment><span>{report.reportDescription}</span><br/></React.Fragment> }
                        { (REPORT_VIEW_PATHS[activeTabKey].key === INITIAL_SAVINGS_ESTIMATION_KEY) && <React.Fragment>
                                <span>Source:</span>&nbsp;<span>vSphere Enterprise Plus</span><br/>
                                <span>Target:</span>&nbsp;<span>Red Hat Virtualization</span><br/>
                            </React.Fragment>
                        }
                        <span>Date:</span>&nbsp;<span>{ report ? formatDate(new Date(report.lastUpdate)) : 'Unknown' }</span>
                    </p>
                </div>
                <Tabs
                    isFilled={ true }
                    onSelect={ this.handleTabClick }
                    activeKey={ activeTabKey }
                    isBox={ true }
                >
                    { REPORT_VIEW_PATHS.map((elem, index) => {
                        return (
                            <Tab key={ index } eventKey={ index } title={ elem.title } />
                        );
                    })}
                </Tabs>
            </React.Fragment>
        );
    };

    public renderTabsSkeleton = () => {
        return (
            <React.Fragment>
                <Stack hasGutter={true}>
                    <StackItem>
                        <Skeleton size="sm" />
                    </StackItem>
                    <StackItem>
                        <Skeleton size="sm" />
                    </StackItem>
                    <StackItem>
                        <Skeleton size="sm" />
                    </StackItem>
                    <StackItem>
                        <Grid>
                            <GridItem span={4}>
                                <Skeleton size="md" />
                            </GridItem>
                            <GridItem span={4}>
                                <Skeleton size="md" />
                            </GridItem>
                            <GridItem span={4}>
                                <Skeleton size="md" />
                            </GridItem>
                        </Grid>
                    </StackItem>
                </Stack>
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
