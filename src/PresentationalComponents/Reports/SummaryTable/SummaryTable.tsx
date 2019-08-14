import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableVariant,
    ICell,
    TableHeader
} from '@patternfly/react-table';
import { formatNumber } from '../../../Utilities/formatValue';
import { Summary } from '../../../models';
import './SummaryTable.scss';

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
                formatNumber(element.hosts, 0),
                formatNumber(element.sockets, 0),
                formatNumber(element.clusters, 0),
                formatNumber(element.vms, 0)
            ];
        });

        return (
            <React.Fragment>
                <Table
                    aria-label='Summary table'
                    cells={ columns }
                    rows={ rows }
                    variant={ TableVariant.compact }
                    borders={ false }
                >
                    <TableHeader />
                    <TableBody />
                    <tfoot>
                        <tr className="summary-table-footer">
                            <td colSpan={ 3 }>
                                <strong>Total</strong>
                            </td>
                            <td>
                                <strong>{ formatNumber(totalHosts, 0) }</strong>
                            </td>
                            <td>
                                <strong>{ formatNumber(totalSockets, 0) }</strong>
                            </td>
                            <td>
                                <strong>{ formatNumber(totalClusters, 0) }</strong>
                            </td>
                            <td>
                                <strong>{ formatNumber(totalVms, 0) }</strong>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </React.Fragment>
        );
    }
}

export default SummaryTable;
