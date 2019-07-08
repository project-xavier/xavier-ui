import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableVariant
} from '@patternfly/react-table';
import { formatValue } from '../../../Utilities/formatValue';

interface Props {
}

interface State {
}

class ProjectCostBreakdownInYear4PerVM extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const columns = [
            { title: '' },
            { title: '', props: { className: 'pf-u-text-align-right' }}
        ];

        const rows = [
            [
                'Red Hat Virtualization subscription costs (including growth and RHEL)',
                formatValue(1235, 'usd')
            ],
            [
                'Estimated number of VMs in the infraestructure',
                formatValue(1235, 'usd')
            ],
            [
                {
                    title: <strong>Red Hat Virtualization cost per VM (including RHEL)</strong>
                },
                {
                    title: <strong>{ formatValue(3239892, 'usd') }</strong>
                }
            ]
        ];

        return (
            <React.Fragment>
                <Table aria-label='Project cost breakdown in year 4'
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

export default ProjectCostBreakdownInYear4PerVM;
