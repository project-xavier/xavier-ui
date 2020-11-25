import React, { Component } from 'react';
import { Table, TableBody, TableVariant, ICell, TableHeader } from '@patternfly/react-table';
import { formatNumber } from '../../../Utilities/formatValue';
import { Summary } from '../../../models';
import './SummaryTable.scss';
import { isNullOrUndefined } from '../../../Utilities/formUtils';

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
      columns: ['Provider', 'Product', 'Version', 'Hosts', 'Sockets', 'Clusters', 'VMs'],
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
      totalHosts += element.hosts || 0;
      totalSockets += element.sockets || 0;
      totalClusters += element.clusters || 0;
      totalVms += element.vms || 0;

      return [
        !isNullOrUndefined(element.provider) ? element.provider : '',
        !isNullOrUndefined(element.product) ? element.product : '',
        !isNullOrUndefined(element.version) ? element.version : '',
        !isNullOrUndefined(element.hosts) ? formatNumber(element.hosts, 0) : '',
        !isNullOrUndefined(element.sockets) ? formatNumber(element.sockets, 0) : '',
        !isNullOrUndefined(element.clusters) ? formatNumber(element.clusters, 0) : '',
        !isNullOrUndefined(element.vms) ? formatNumber(element.vms, 0) : '',
      ];
    });

    return (
      <React.Fragment>
        <Table
          aria-label="Summary table"
          cells={columns}
          rows={rows}
          variant={TableVariant.compact}
          borders={false}
        >
          <TableHeader />
          <TableBody />
          <tfoot>
            <tr className="summary-table-footer">
              <td colSpan={3}>
                <strong>Total</strong>
              </td>
              <td>
                <strong>{formatNumber(totalHosts, 0)}</strong>
              </td>
              <td>
                <strong>{formatNumber(totalSockets, 0)}</strong>
              </td>
              <td>
                <strong>{formatNumber(totalClusters, 0)}</strong>
              </td>
              <td>
                <strong>{formatNumber(totalVms, 0)}</strong>
              </td>
            </tr>
          </tfoot>
        </Table>
      </React.Fragment>
    );
  }
}

export default SummaryTable;
