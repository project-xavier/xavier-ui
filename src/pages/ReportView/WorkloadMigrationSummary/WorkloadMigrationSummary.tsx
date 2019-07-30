import React from 'react';

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

    public render() {
        return (
            <React.Fragment>
                <p>WorkloadMigrationSummary...</p>
            </React.Fragment>
        );
    }
}

export default WorkloadMigrationSummary;
