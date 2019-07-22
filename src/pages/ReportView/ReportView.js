import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReportViewPage from '../../PresentationalComponents/ReportViewPage';
import asyncComponent from '../../Utilities/asyncComponent';
import { REPORT_VIEW_PATHS } from './ReportViewConstants';

const WorkloadMigrationSummary = asyncComponent(() =>
    import(/* webpackChunkName: "WorkloadMigrationSummary" */ './WorkloadMigrationSummary'));
const InitialSavingsEstimation = asyncComponent(() =>
    import(/* webpackChunkName: "InitialSavingsEstimation" */ './InitialSavingsEstimation'));
const WorkloadInventory = asyncComponent(() =>
    import(/* webpackChunkName: "WorkloadInventory" */ './WorkloadInventory'));

class ReportView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reportId: props.match.params.reportId
        };
    }

    componentDidMount() {
        const { reportId } = this.state;
        this.props.fetchReport(reportId);
    }

    render() {
        const { report, reportFetchStatus } = this.props;
        return (
            <ReportViewPage
                report={ report }
                reportFetchStatus={ reportFetchStatus }
            >
                <Switch>
                    <Route
                        path={ `${this.props.match.url}/${REPORT_VIEW_PATHS.workloadMigrationSummary}` }
                        component={ WorkloadMigrationSummary }
                    />
                    <Route
                        path={ `${this.props.match.url}/${REPORT_VIEW_PATHS.initialSavingsEstimation}` }
                        component={ InitialSavingsEstimation }
                    />
                    <Route
                        path={ `${this.props.match.url}/${REPORT_VIEW_PATHS.workloadInventory}` }
                        component={ WorkloadInventory }
                    />

                    <Redirect
                        from={ `${this.props.match.url}` }
                        to={ `${this.props.match.url}/${REPORT_VIEW_PATHS.initialSavingsEstimation}` }
                    />
                </Switch>
            </ReportViewPage>
        );
    }
}

ReportView.propTypes = {
    match: PropTypes.object,
    report: PropTypes.object,
    reportFetchStatus: PropTypes.object,
    fetchReport: PropTypes.func
};

export default ReportView;
