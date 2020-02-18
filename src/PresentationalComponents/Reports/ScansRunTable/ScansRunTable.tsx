import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableVariant,
    ICell,
    TableHeader
} from '@patternfly/react-table';
import { formatDate } from '../../../Utilities/formatValue';
import { ScanRunModel } from '../../../models';

export interface Props {
    scanRuns: ScanRunModel[];
}

interface State {
    columns: Array<ICell | string>;
}

class ScansRunTable extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            columns: [
                'Target',
                'Type',
                'Date'
            ]
        };
    }

    public render() {
        const { columns } = this.state;
        const { scanRuns } = this.props;

        const rows = scanRuns.map((element) => {
            return [
                element.target,
                element.smartStateEnabled ? 'Virt Platform + SmartState' : 'Virt Platform',
                formatDate(new Date(element.date), false)
            ];
        });

        return (
            <React.Fragment>
                <Table
                    aria-label='Scans run table'
                    cells={ columns }
                    rows={ rows }
                    variant={ TableVariant.compact }
                    borders={ false }
                >
                    <TableHeader />
                    <TableBody />                    
                </Table>
            </React.Fragment>
        );
    }
}

export default ScansRunTable;
