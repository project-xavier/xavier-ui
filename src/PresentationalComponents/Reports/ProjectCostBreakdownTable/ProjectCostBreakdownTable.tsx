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

    public getSourceMaintenanceTotal = (): number | undefined => {
        const { sourceRampDownCostsModel } = this.props;

        if (isNotNullOrUndefined(
            sourceRampDownCostsModel.year1SourceMaintenanceTotalValue,
            sourceRampDownCostsModel.year2SourceMaintenanceTotalValue,
            sourceRampDownCostsModel.year3SourceMaintenanceTotalValue
        )) {
            return undefined;
        }

        return sourceRampDownCostsModel.year1SourceMaintenanceTotalValue +
            sourceRampDownCostsModel.year2SourceMaintenanceTotalValue +
            sourceRampDownCostsModel.year3SourceMaintenanceTotalValue;
    }

    public getHypervisorSubscriptions = (): number | undefined => {
        const { rhvRampUpCostsModel } = this.props;

        if (isNotNullOrUndefined(
            rhvRampUpCostsModel.year1RhvTotalValue,
            rhvRampUpCostsModel.year1RhvTotalValue,
            rhvRampUpCostsModel.year1RhvTotalValue
        )) {
            return undefined;
        }

        return rhvRampUpCostsModel.year1RhvTotalValue +
            rhvRampUpCostsModel.year2RhvTotalValue +
            rhvRampUpCostsModel.year3RhvTotalValue;
    }

    public gethypervisorGrowthSubscriptions = (): number | undefined => {
        const { rhvRampUpCostsModel } = this.props;

        if (isNotNullOrUndefined(
            rhvRampUpCostsModel.year1RhvGrandTotalGrowthValue,
            rhvRampUpCostsModel.year2RhvGrandTotalGrowthValue,
            rhvRampUpCostsModel.year3RhvGrandTotalGrowthValue
        )) {
            return undefined;
        }

        return rhvRampUpCostsModel.year1RhvGrandTotalGrowthValue +
            rhvRampUpCostsModel.year2RhvGrandTotalGrowthValue +
            rhvRampUpCostsModel.year3RhvGrandTotalGrowthValue;
    }

    public render() {
        const { rhvRampUpCostsModel } = this.props;

        const sourceMaintenanceTotal = this.getSourceMaintenanceTotal();
        const hypervisorSubscriptions = this.getHypervisorSubscriptions();
        const hypervisorGrowthSubscriptions = this.gethypervisorGrowthSubscriptions();

        const rhvSwitchLearningSubsValue = rhvRampUpCostsModel.rhvSwitchLearningSubsValue;
        const rhvSwitchConsultValue = rhvRampUpCostsModel.rhvSwitchConsultValue;
        const rhvSwitchTAndEValue = rhvRampUpCostsModel.rhvSwitchTAndEValue;

        let total: number | undefined;
        if (!isNotNullOrUndefined(
            sourceMaintenanceTotal,
            hypervisorSubscriptions,
            hypervisorGrowthSubscriptions,
            rhvSwitchLearningSubsValue,
            rhvSwitchConsultValue,
            rhvSwitchTAndEValue
        )) {
            total = (sourceMaintenanceTotal || 0) +
                (hypervisorSubscriptions || 0) +
                (hypervisorGrowthSubscriptions || 0) +
                rhvSwitchLearningSubsValue +
                rhvSwitchConsultValue +
                rhvSwitchTAndEValue;
        }

        const columns = [
            '',
            '',
            { title: '', props: { className: 'pf-u-text-align-right' }}
        ];

        const rows = [
            [
                'VMware maintenance',
                'VMware support costs (during migration)',
                isNotNullOrUndefined(sourceMaintenanceTotal) ? 'Unknown' : formatValue(sourceMaintenanceTotal, 'usd', { fractionDigits: 0 })
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
                isNotNullOrUndefined(hypervisorSubscriptions) ? 'Unknown' : formatValue(hypervisorSubscriptions, 'usd', { fractionDigits: 0 })
            ],
            [
                '',
                'RHV hypervisor growth subscriptions',
                isNotNullOrUndefined(hypervisorGrowthSubscriptions) ? 'Unknown' : formatValue(hypervisorGrowthSubscriptions, 'usd', { fractionDigits: 0 })
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
                    title: <strong>{ isNotNullOrUndefined(total) ? 'Unknown' : formatValue(total, 'usd', { fractionDigits: 0 }) }</strong>
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
