import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableVariant
} from '@patternfly/react-table';
import { EnvironmentModel } from '../../../models';
import { isNotNullOrUndefined } from '../../../Utilities/formUtils';

interface Props {
    data: EnvironmentModel
}

interface State {
}

class Environment extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
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
                isNotNullOrUndefined(hypervisors) ? 'Unknown' : hypervisors.toLocaleString()
            ],
            [
                'ESXi hypervisors would be migrated to RH technologies',
                'Year1 (incremental)',
                isNotNullOrUndefined(year1Hypervisor) ? 'Unknown' : year1Hypervisor.toLocaleString()
            ],
            [
                '',
                'Year2 (incremental)',
                isNotNullOrUndefined(year2Hypervisor) ? 'Unknown' : year2Hypervisor.toLocaleString()
            ],
            [
                '',
                'Year3 (incremental)',
                isNotNullOrUndefined(year3Hypervisor) ? 'Unknown' : year3Hypervisor.toLocaleString()
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
