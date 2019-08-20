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
import { isNotNullOrUndefined } from '../../../Utilities/formUtils';

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
            totalHosts += (element.hosts || 0);
            totalSockets += (element.sockets || 0);
            totalClusters += (element.clusters || 0);
            totalVms += (element.vms || 0);

            return [
                !isNotNullOrUndefined(element.provider) ? element.provider : '',
                !isNotNullOrUndefined(element.product) ? element.product : '',
                !isNotNullOrUndefined(element.version) ? element.version : '',
                !isNotNullOrUndefined(element.hosts) ? formatNumber(element.hosts, 0) : '',
                !isNotNullOrUndefined(element.sockets) ? formatNumber(element.sockets, 0) : '',
                !isNotNullOrUndefined(element.clusters) ? formatNumber(element.clusters, 0) : '',
                !isNotNullOrUndefined(element.vms) ? formatNumber(element.vms, 0) : '',
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
