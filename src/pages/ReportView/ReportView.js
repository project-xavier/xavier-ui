import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { REPORT_VIEW_PATHS, DEFAULT_VIEW_PATH_INDEX } from './ReportViewConstants';
import ReportViewPage from '../../PresentationalComponents/ReportViewPage';

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
        const { reportId } = this.state;

        if (!reportId || reportFetchStatus.error) {
            return <Redirect to="/report" />;
        }

        return (
            <ReportViewPage
                report={ report }
                reportFetchStatus={ reportFetchStatus }
            >
                <Switch>
                    { REPORT_VIEW_PATHS.map((elem, index) => {
                        const Component = elem.component;
                        return (
                            <Route
                                key={ index }
                                path={ `${this.props.match.url}/${elem.path}` }
                                render={ () => <Component reportId={reportId} /> }
                            />
                        );
                    })}

                    <Redirect
                        from={ `${this.props.match.url}` }
                        to={ `${this.props.match.url}/${REPORT_VIEW_PATHS[DEFAULT_VIEW_PATH_INDEX].path}` }
                    />
                </Switch>
            </ReportViewPage>
        );
    }
}

ReportView.propTypes = {
    report: PropTypes.any,
    reportFetchStatus: PropTypes.object,
    fetchReport: PropTypes.func,
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object
};

export default ReportView;
