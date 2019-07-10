import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import WorkloadMigrationSummary from './WorkloadMigrationSummary';

const mapStateToProps = ()  => {
    return {
    };
};

const mapDispatchToProps = {
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(WorkloadMigrationSummary)
);
