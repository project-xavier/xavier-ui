import React from 'react';
import { Label, Tooltip } from '@patternfly/react-core';
import { ReportWorkloadInventory } from '../../../../models';
import { formatNumber, formatBytes } from '../../../../Utilities/formatValue';

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
                    <dt>Recommended targets</dt>
                    <dd>{reportWorkloadInventory.recommendedTargetsIMS.map((e, index) => {
                        return (
                            <Tooltip key={index}
                                position="top"
                                content={
                                    <div>VM suitable to be migrated to {e}</div>
                                }
                            >
                                <React.Fragment>
                                    <Label>{e}</Label>&nbsp;
                                </React.Fragment>
                            </Tooltip>
                        );
                    })}
                    </dd>
                    <dt>Flags</dt>
                    <dd>{
                        reportWorkloadInventory.flagsIMS && reportWorkloadInventory.flagsIMS.length > 0
                         ? reportWorkloadInventory.flagsIMS.join(", ")
                         : 'None identified'
                    }
                    </dd>
                    <dt>Disk space</dt>
                    <dd>{formatBytes(reportWorkloadInventory.diskSpace, 1)}</dd>
                    <dt>Memory</dt>
                    <dd>{formatBytes(reportWorkloadInventory.memory, 1)}</dd>
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
