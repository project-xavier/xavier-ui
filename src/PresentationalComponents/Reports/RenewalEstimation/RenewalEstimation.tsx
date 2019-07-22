import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableVariant,
    TableHeader
} from '@patternfly/react-table';
import { formatValue } from '../../../Utilities/formatValue';
import { SourceCostsModel } from '../../../models';
import { isNotNullOrUndefined } from '../../../Utilities/formUtils';

interface Props {
    data: SourceCostsModel
}

interface State {
}

class RenewalEstimation extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        const { data: {
            sourceRenewHighValue,
            sourceRenewLikelyValue,
            sourceRenewLowValue
        }} = this.props;

        const columns = [
            'For vSphere Enterprise Plus',
            { title: 'ELA Renewal Estimation', props: { className: 'pf-u-text-align-right' }}
        ];

        const rows = [
            [
                '-- As high as...',
                isNotNullOrUndefined(sourceRenewHighValue) ? 'Unknown' : formatValue(sourceRenewHighValue, 'usd', { fractionDigits: 0 })
            ],
            [
                '-- Most likely...',
                isNotNullOrUndefined(sourceRenewLikelyValue) ? 'Unknown' : formatValue(sourceRenewLikelyValue, 'usd', { fractionDigits: 0 })
            ],
            [
                '-- As low as...',
                isNotNullOrUndefined(sourceRenewLowValue) ? 'Unknown' : formatValue(sourceRenewLowValue, 'usd', { fractionDigits: 0 })
            ]
        ];

        return (
            <React.Fragment>
                <Table aria-label='Renewal estimation'
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
