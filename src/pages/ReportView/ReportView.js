import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReportViewPage from '../../PresentationalComponents/ReportViewPage';
import { REPORT_VIEW_PATHS, DEFAULT_VIEW_PATH_INDEX } from './ReportViewConstants';

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
                    { REPORT_VIEW_PATHS.map((elem, index) => {
                        return (
                            <Route
                                key={ index }
                                path={ `${this.props.match.url}/${elem.path}` }
                                component={ elem.component }
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
    match: PropTypes.object,
    report: PropTypes.any,
    reportFetchStatus: PropTypes.object,
    fetchReport: PropTypes.func
};

export default ReportView;
