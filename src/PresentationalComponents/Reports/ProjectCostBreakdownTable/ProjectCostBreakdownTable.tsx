import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableVariant
} from '@patternfly/react-table';
import { formatValue } from '../../../Utilities/formatValue';
import { RHVRampUpCostsModel, SourceRampDownCostsModel } from '../../../models';

interface Props {
    rhvRampUpCostsModel: RHVRampUpCostsModel;
    sourceRampDownCostsModel: SourceRampDownCostsModel;
}

interface State {
}

class ProjectCostBreakdownTable extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const {
            rhvRampUpCostsModel,
            sourceRampDownCostsModel
        } = this.props;

        const sourceMaintenanceTotal = sourceRampDownCostsModel.year1SourceMaintenanceTotalValue +
            sourceRampDownCostsModel.year2SourceMaintenanceTotalValue +
            sourceRampDownCostsModel.year3SourceMaintenanceTotalValue;

        const hypervisorSubscriptions = rhvRampUpCostsModel.year1RhvTotalValue +
            rhvRampUpCostsModel.year2RhvTotalValue +
            rhvRampUpCostsModel.year3RhvTotalValue;

        const hypervisorGrowthSubscriptions = rhvRampUpCostsModel.year1RhvGrandTotalGrowthValue +
            rhvRampUpCostsModel.year2RhvGrandTotalGrowthValue +
            rhvRampUpCostsModel.year3RhvGrandTotalGrowthValue;

        const rhvSwitchLearningSubsValue = rhvRampUpCostsModel.rhvSwitchLearningSubsValue;
        const rhvSwitchConsultValue = rhvRampUpCostsModel.rhvSwitchConsultValue;
        const rhvSwitchTAndEValue = rhvRampUpCostsModel.rhvSwitchTAndEValue;

        const total = sourceMaintenanceTotal +
            hypervisorSubscriptions +
            hypervisorGrowthSubscriptions +
            rhvSwitchLearningSubsValue +
            rhvSwitchConsultValue +
            rhvSwitchTAndEValue;

        const columns = [
            { title: '' },
            { title: '' },
            { title: '', props: { className: 'pf-u-text-align-right' }}
        ];

        const rows = [
            [
                'VMware maintenance',
                'VMware support costs (during migration)',
                formatValue(sourceMaintenanceTotal, 'usd')
            ],
            [
                {
                    title: <div>&nbsp;</div>
                },
                {
                    title: <div>&nbsp;</div>
                },
                {
                    title: <div>&nbsp;</div>
                }
            ],
            [
                'Red Hat Virtualization costs',
                '',
                ''
            ],
            [
                '',
                'RHV hypervisor subscriptions',
                formatValue(hypervisorSubscriptions, 'usd')
            ],
            [
                '',
                'RHV hypervisor growth subscriptions',
                formatValue(hypervisorGrowthSubscriptions, 'usd')
            ],
            [
                'Red Hat training and services',
                '',
                ''
            ],
            [
                '',
                'Red Hat training',
                formatValue(rhvSwitchLearningSubsValue, 'usd')
            ],
            [
                '',
                'Red Hat consulting',
                formatValue(rhvSwitchConsultValue, 'usd')
            ],
            [
                '',
                'Travel and lodging',
                formatValue(rhvSwitchTAndEValue, 'usd')
            ],
            [
                {
                    title: <strong>Total</strong>
                },
                '',
                {
                    title: <strong>{ formatValue(total, 'usd') }</strong>
                }
            ]
        ];

        return (
            <React.Fragment>
                <Table aria-label='Project cost breakdown'
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

export default ProjectCostBreakdownTable;
