import React from 'react';
import { ReportWorkloadInventory } from '../../../../models';
import { formatValue, formatNumber } from '../../../../Utilities/formatValue';
import { bytesToGb } from '../../../../Utilities/unitConvertors';

export interface WorkloadInventoryDetailsProps {
    reportWorkloadInventory: ReportWorkloadInventory;
}

interface State {}

export class WorkloadInventoryDetails extends React.Component<WorkloadInventoryDetailsProps, State> {
    constructor(props: WorkloadInventoryDetailsProps) {
        super(props);
    }

    public render() {
        const { reportWorkloadInventory } = this.props;

        return (
            <div className="pf-c-content">
                <dl>
                    <dt>Disk space (GiB)</dt>
                    <dd>{formatValue(bytesToGb(reportWorkloadInventory.diskSpace), 'gb', { fractionDigits: 1 })}</dd>
                    <dt>Memory (GiB)</dt>
                    <dd>{formatValue(bytesToGb(reportWorkloadInventory.memory), 'gb', { fractionDigits: 1 })}</dd>
                    <dt>CPU cores</dt>
                    <dd>{formatNumber(reportWorkloadInventory.cpuCores, 0)}</dd>
                    <dt>Operating system description</dt>
                    <dd>{reportWorkloadInventory.osDescription}</dd>
                    <dt>Red Hat Insights</dt>
                    <dd>{reportWorkloadInventory.insightsEnabled ? 'Enabled' : 'Disabled'}</dd>
                </dl>
            </div>
        );
    }
}
