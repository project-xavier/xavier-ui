import React, { Component } from 'react';
import { Table, TableBody, TableVariant } from '@patternfly/react-table';
import { EnvironmentModel } from '../../../models';
import { isNullOrUndefined } from '../../../Utilities/formUtils';
import { formatNumber } from '../../../Utilities/formatValue';

interface Props {
  data: EnvironmentModel;
}

class Environment extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const {
      data: {
        hypervisors,
        year1Hypervisor,
        year2Hypervisor,
        year3Hypervisor,
        growthRatePercentage,
      },
    } = this.props;

    const columns = ['', '', ''];

    const rows = [
      [
        'Licenses for ESXi Hypervisors (2 socket)',
        '',
        isNullOrUndefined(hypervisors) ? 'Unknown' : formatNumber(hypervisors, 0),
      ],
      [
        'VMware licenses (2 socket) to migrate to Red Hat technologies',
        'Year1 (incremental)',
        isNullOrUndefined(year1Hypervisor) ? 'Unknown' : formatNumber(year1Hypervisor, 0),
      ],
      [
        '',
        'Year2 (incremental)',
        isNullOrUndefined(year2Hypervisor) ? 'Unknown' : formatNumber(year2Hypervisor, 0),
      ],
      [
        '',
        'Year3 (incremental)',
        isNullOrUndefined(year3Hypervisor) ? 'Unknown' : formatNumber(year3Hypervisor, 0),
      ],
      [
        'Year-over-year growth rate for new hypervisors',
        '',
        isNullOrUndefined(growthRatePercentage)
          ? 'Unknown'
          : `${(growthRatePercentage * 100).toLocaleString()}%`,
      ],
    ];

    return (
      <React.Fragment>
        <Table aria-label="Environment" cells={columns} rows={rows} variant={TableVariant.compact}>
          <TableBody />
        </Table>
      </React.Fragment>
    );
  }
}

export default Environment;
