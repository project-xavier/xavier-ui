import React from 'react';
import './WorkloadMigrationSummary.scss';

interface StateToProps {
}

interface DispatchToProps {
}

interface Props extends StateToProps, DispatchToProps {
};

interface State {
};

class WorkloadMigrationSummary extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <p>Work in progress...</p>
            </React.Fragment>
        );
    }
}

export default WorkloadMigrationSummary;
