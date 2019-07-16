import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableVariant
} from '@patternfly/react-table';
import { formatValue } from '../../../Utilities/formatValue';
import { RHVRampUpCostsModel, SourceRampDownCostsModel } from '../../../models';
import { isNotNullOrUndefined } from '../../../Utilities/formUtils';

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

    getSourceMaintenanceTotal = () => {
        const { sourceRampDownCostsModel } = this.props;

        return sourceRampDownCostsModel.year1SourceMaintenanceTotalValue +
            sourceRampDownCostsModel.year2SourceMaintenanceTotalValue +
            sourceRampDownCostsModel.year3SourceMaintenanceTotalValue;
    }

    getHypervisorSubscriptions = () => {
        const { rhvRampUpCostsModel } = this.props;

        return rhvRampUpCostsModel.year1RhvTotalValue +
            rhvRampUpCostsModel.year2RhvTotalValue +
            rhvRampUpCostsModel.year3RhvTotalValue;
    }

    gethypervisorGrowthSubscriptions = () => {
        const { rhvRampUpCostsModel } = this.props;

        return rhvRampUpCostsModel.year1RhvGrandTotalGrowthValue +
            rhvRampUpCostsModel.year2RhvGrandTotalGrowthValue +
            rhvRampUpCostsModel.year3RhvGrandTotalGrowthValue;
    }

    render() {
        const { rhvRampUpCostsModel } = this.props;

        const sourceMaintenanceTotal = this.getSourceMaintenanceTotal();
        const hypervisorSubscriptions = this.getHypervisorSubscriptions();
        const hypervisorGrowthSubscriptions = this.gethypervisorGrowthSubscriptions();

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
            '',
            '',
            { title: '', props: { className: 'pf-u-text-align-right' }}
        ];

        const rows = [
            [
                'VMware maintenance',
                'VMware support costs (during migration)',
                Number.isNaN(sourceMaintenanceTotal) ? 'Unknown' : formatValue(sourceMaintenanceTotal, 'usd', { fractionDigits: 0 })
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
                Number.isNaN(hypervisorSubscriptions) ? 'Unknown' : formatValue(hypervisorSubscriptions, 'usd', { fractionDigits: 0 })
            ],
            [
                '',
                'RHV hypervisor growth subscriptions',
                Number.isNaN(hypervisorGrowthSubscriptions) ? 'Unknown' : formatValue(hypervisorGrowthSubscriptions, 'usd', { fractionDigits: 0 })
            ],
            [
                'Red Hat training and services',
                '',
                ''
            ],
            [
                '',
                'Red Hat training',
                isNotNullOrUndefined(rhvSwitchLearningSubsValue) ? 'Unknown' : formatValue(rhvSwitchLearningSubsValue, 'usd', { fractionDigits: 0 })
            ],
            [
                '',
                'Red Hat consulting',
                isNotNullOrUndefined(rhvSwitchConsultValue) ? 'Unknown' : formatValue(rhvSwitchConsultValue, 'usd', { fractionDigits: 0 })
            ],
            [
                '',
                'Travel and lodging',
                isNotNullOrUndefined(rhvSwitchTAndEValue) ? 'Unknown' : formatValue(rhvSwitchTAndEValue, 'usd', { fractionDigits: 0 })
            ],
            [
                {
                    title: <strong>Total</strong>
                },
                '',
                {
                    title: <strong>{ Number.isNaN(total) ? 'Unknown' : formatValue(total, 'usd', { fractionDigits: 0 }) }</strong>
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
