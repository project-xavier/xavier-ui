import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { fetchReport } from '../../actions/ReportActions';
import { RouterGlobalProps } from '../../models/router';
import { Report } from '../../models';
import { GlobalState } from '../../models/state';
import { ReportViewPage } from '../../PresentationalComponents/ReportViewPage';
import WorkloadMigrationSummary from './WorkloadMigrationSummary';
import InitialSavingsEstimation from './InitialSavingsEstimation';
import WorkloadInventory from './WorkloadInventory';

interface StateToProps {
    error: string | null;
    report: Report | null;
    loading: boolean;
}

interface DispatchToProps {
    fetchReport: (reportId: number) => void;
}

interface Props extends StateToProps, DispatchToProps, RouterGlobalProps {
};

interface State {
    reportId: number;
};

export class ReportView extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            reportId: props.match.params.reportId
        };
    }

    componentDidMount(): void {
        const id: number = this.state.reportId;
        if (id) {
            this.props.fetchReport(id);
        }
    }

    render() {
        const { error } = this.props;
        const { reportId } = this.state;

        if (!reportId || error) {
            return <Redirect to={ `/reports` } />;
        }

        return (
            <ReportViewPage reportId={ reportId } history={ this.props.history } match={ this.props.match }>
                <Switch>
                    <Route path={ `${this.props.match.url}/workloadMigrationSummary` } component={ WorkloadMigrationSummary } />
                    <Route path={ `${this.props.match.url}/initialSavingsEstimation` } component={ InitialSavingsEstimation } />
                    <Route path={ `${this.props.match.url}/workloadInventory` } component={ WorkloadInventory } />
                    <Redirect from={ `${this.props.match.url}` } to={ `${this.props.match.url}/workloadMigrationSummary` } />
                </Switch>
            </ReportViewPage>
        );
    }
}

const mapStateToProps = (state: GlobalState)  => {
    let { report, loading, error } = state.reportState;
    return {
        report,
        loading,
        error
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        fetchReport
    }, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportView));
