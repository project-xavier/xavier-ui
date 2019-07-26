import React from 'react';
import { RouterGlobalProps } from '../../../models/router';

interface StateToProps extends RouterGlobalProps {
}

interface DispatchToProps {
    fetchReport: (reportId: number) => void;
}

interface Props extends StateToProps, DispatchToProps {
};

interface State {
    reportId: number;
};

class WorkloadInventory extends React.Component<Props, State> {

    public render() {
        return (
            <p>WorkloadInventory...</p>
        );
    }
}

export default WorkloadInventory;
