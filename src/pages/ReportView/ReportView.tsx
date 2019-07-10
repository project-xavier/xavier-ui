import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import { RouterGlobalProps } from '../../models/router';
import { Report } from '../../models';
import ReportViewPage from '../../PresentationalComponents/ReportViewPage';
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

class ReportView extends React.Component<Props, State> {

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
        const { report, error } = this.props;
        const { reportId } = this.state;

        if (!reportId || error) {
            return <Redirect to={ `/reports` } />;
        }

        return (
            <ReportViewPage report={ report }>
                <Switch>
                    <Route path={ `${this.props.match.url}/workloadMigrationSummary` } component={ WorkloadMigrationSummary } />
                    <Route path={ `${this.props.match.url}/initialSavingsEstimation` } component={ InitialSavingsEstimation } />
                    <Route path={ `${this.props.match.url}/workloadInventory` } component={ WorkloadInventory } />

                    { /* // TODO Change this when other tabs are implemented */ }
                    <Redirect from={ `${this.props.match.url}` } to={ `${this.props.match.url}/initialSavingsEstimation` } />
                </Switch>
            </ReportViewPage>
        );
    }
}

export default ReportView;
