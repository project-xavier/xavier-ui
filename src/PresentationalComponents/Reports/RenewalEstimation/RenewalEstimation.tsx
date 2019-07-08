import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableVariant,
    TableHeader
} from '@patternfly/react-table';
import { formatValue } from '../../../Utilities/formatValue';
import { SourceCostsModel } from '../../../models';

interface Props {
    data: SourceCostsModel
}

interface State {
}

class RenewalEstimation extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const { data: {
            sourceRenewHighValue,
            sourceRenewLikelyValue,
            sourceRenewLowValue
        }} = this.props;

        const columns = [
            { title: 'For vSphere Enterprise Plus' },
            { title: 'ELA Renewal Estimation', props: { className: 'pf-u-text-align-right' }}
        ];

        const rows = [
            [
                '-- As high as...',
                formatValue(sourceRenewHighValue, 'usd')
            ],
            [
                '-- Most likely...',
                formatValue(sourceRenewLikelyValue, 'usd')
            ],
            [
                '-- As low as...',
                formatValue(sourceRenewLowValue, 'usd')
            ]
        ];

        return (
            <React.Fragment>
                <Table aria-label='Environment'
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

export default RenewalEstimation;
