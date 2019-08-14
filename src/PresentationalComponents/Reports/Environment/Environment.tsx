import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableVariant
} from '@patternfly/react-table';
import { EnvironmentModel } from '../../../models';
import { isNotNullOrUndefined } from '../../../Utilities/formUtils';
import { formatNumber, formatPercentage } from '../../../Utilities/formatValue';

interface Props {
    data: EnvironmentModel
}

interface State {
}

class Environment extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        const { data: {
            hypervisors,
            year1Hypervisor,
            year2Hypervisor,
            year3Hypervisor,
            growthRatePercentage
        }} = this.props;

        const columns = [
            '',
            '',
            ''
        ];

        const rows = [
            [
                'ESXi hypervisors (2-socket servers)',
                '',
                isNotNullOrUndefined(hypervisors) ? 'Unknown' : formatNumber(hypervisors, 0)
            ],
            [
                'ESXi hypervisors would be migrated to RH technologies',
                'Year1 (incremental)',
                isNotNullOrUndefined(year1Hypervisor) ? 'Unknown' : formatNumber(year1Hypervisor, 0)
            ],
            [
                '',
                'Year2 (incremental)',
                isNotNullOrUndefined(year2Hypervisor) ? 'Unknown' : formatNumber(year2Hypervisor, 0)
            ],
            [
                '',
                'Year3 (incremental)',
                isNotNullOrUndefined(year3Hypervisor) ? 'Unknown' : formatNumber(year3Hypervisor, 0)
            ],
            [
                'Year-over-year growth rate for new hypervisors',
                '',
                isNotNullOrUndefined(growthRatePercentage) ? 'Unknown' : `${(growthRatePercentage * 100).toLocaleString()}%`
            ]
        ];

        return (
            <React.Fragment>
                <Table aria-label='Environment'
                    cells={ columns }
                    rows={ rows }
                    variant={ TableVariant.compact }
                >
                    <TableBody />
                </Table>
            </React.Fragment>
        );
    }
}

export default Environment;
