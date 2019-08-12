import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableVariant,
    ICell,
    TableHeader
} from '@patternfly/react-table';
import { formatValue } from '../../../Utilities/formatValue';
import { Summary } from '../../../models';

interface Props {
    summary: Summary[];
}

interface State {
    columns: Array<ICell | string>;
}

class SummaryTable extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            columns: [
                'Provider',
                'Product',
                'Version',
                'Host',
                'Sockets',
                'Clusters',
                'VMs'
            ]
        };
    }

    public render() {
        const { columns } = this.state;
        const { summary } = this.props;

        let totalHosts = 0;
        let totalSockets = 0;
        let totalClusters = 0;
        let totalVms = 0;

        const rows = summary.map((element) => {
            totalHosts += element.hosts;
            totalSockets += element.sockets;
            totalClusters += element.clusters;
            totalVms += element.vms;

            return [
                element.provider,
                element.product,
                element.version,
                formatValue(element.hosts),
                formatValue(element.sockets),
                formatValue(element.clusters),
                formatValue(element.vms)
            ];
        });

        return (
            <React.Fragment>
                <Table
                    aria-label='Summary table'
                    rows={ rows }
                    cells={ columns }
                >
                    <TableHeader />
                    <TableBody />
                    <tfoot>
                        <tr>
                            <td colSpan={ 3 }>
                                <strong>Total</strong>
                            </td>
                            <td>
                                <strong>{ formatValue(totalHosts) }</strong>
                            </td>
                            <td>
                                <strong>{ formatValue(totalSockets) }</strong>
                            </td>
                            <td>
                                <strong>{ formatValue(totalClusters) }</strong>
                            </td>
                            <td>
                                <strong>{ formatValue(totalVms) }</strong>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </React.Fragment>
        );
    }
}

export default SummaryTable;
