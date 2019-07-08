import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableVariant
} from '@patternfly/react-table';
import { EnvironmentModel } from '../../../models';

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
            { title: '' },
            { title: '' },
            { title: '' }
        ];

        const rows = [
            [
                'ESXi hypervisors (2-socket servers)',
                '',
                hypervisors.toLocaleString()
            ],
            [
                'ESXi hypervisors would be migrated to RH technologies',
                'Year1 (incremental)',
                year1Hypervisor.toLocaleString()
            ],
            [
                '',
                'Year2 (incremental)',
                year2Hypervisor.toLocaleString()
            ],
            [
                '',
                'Year3 (incremental)',
                year3Hypervisor.toLocaleString()
            ],
            [
                'Year-over-year growth rate for new hypervisors',
                '',
                `${growthRatePercentage.toLocaleString()}%`
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
