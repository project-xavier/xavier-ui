import React, { Component } from 'react';
import {
    Table,
    TableBody,
    TableVariant
} from '@patternfly/react-table';
import { formatValue } from '../../../Utilities/formatValue';
import { RHVRampUpCostsModel, SourceRampDownCostsModel } from '../../../models';
import { isNullOrUndefined } from '../../../Utilities/formUtils';

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

        if (isNullOrUndefined(
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

        if (isNullOrUndefined(
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

        if (isNullOrUndefined(
            rhvRampUpCostsModel.year1RhvTotalGrowthValue,
            rhvRampUpCostsModel.year2RhvTotalGrowthValue,
            rhvRampUpCostsModel.year3RhvTotalGrowthValue
        )) {
            return undefined;
        }

        // null or undefined  values are already validaded above
        // "|| 0" is written just to avoid "Object is possibly 'undefined'" warning
        return (rhvRampUpCostsModel.year1RhvTotalGrowthValue || 0) +
            (rhvRampUpCostsModel.year2RhvTotalGrowthValue || 0) +
            (rhvRampUpCostsModel.year3RhvTotalGrowthValue || 0);
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
        if (!isNullOrUndefined(
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
            { title: '', props: { className: 'pf-u-text-align-right pf-m-width-30' }}
        ];

        const rows = [
            {
                cells: [
                    'VMware maintenance',
                    'VMware support costs (during migration)',
                    isNullOrUndefined(sourceMaintenanceTotal) ? 'Unknown' : formatValue(sourceMaintenanceTotal, 'usd', { fractionDigits: 0 })
                ]
            },
            {
                cells: [
                    {
                        title: <div>&nbsp;</div>
                    },
                    {
                        title: <div>&nbsp;</div>
                    },
                    {
                        title: <div>&nbsp;</div>
                    }
                ]
            },
            {
                cells: [
                    'Red Hat Virtualization costs',
                    '',
                    ''
                ]
            },
            {
                cells: [
                    '',
                    'Red Hat Virtualization hypervisor subscriptions',
                    isNullOrUndefined(hypervisorSubscriptions) ? 'Unknown' : formatValue(hypervisorSubscriptions, 'usd', { fractionDigits: 0 })
                ]
            },
            {
                cells: [
                    '',
                    'Red Hat Virtualization hypervisor growth subscriptions',
                    isNullOrUndefined(hypervisorGrowthSubscriptions) ? 'Unknown' : formatValue(hypervisorGrowthSubscriptions, 'usd', { fractionDigits: 0 })
                ]
            },
            {
                cells: [
                    'Red Hat training and services',
                    '',
                    ''
                ]
            },
            {
                cells: [
                    '',
                    'Red Hat training',
                    isNullOrUndefined(rhvSwitchLearningSubsValue) ? 'Unknown' : formatValue(rhvSwitchLearningSubsValue, 'usd', { fractionDigits: 0 })
                ]
            },
            {
                cells: [
                    '',
                    'Red Hat consulting',
                    isNullOrUndefined(rhvSwitchConsultValue) ? 'Unknown' : formatValue(rhvSwitchConsultValue, 'usd', { fractionDigits: 0 })
                ]
            },
            {
                cells: [
                    '',
                    'Travel and lodging',
                    isNullOrUndefined(rhvSwitchTAndEValue) ? 'Unknown' : formatValue(rhvSwitchTAndEValue, 'usd', { fractionDigits: 0 })
                ]
            },
            {
                cells: [
                    {
                        title: <strong>Total</strong>
                    },
                    '',
                    {
                        title: <strong>{ isNullOrUndefined(total) ? 'Unknown' : formatValue(total, 'usd', { fractionDigits: 0 }) }</strong>
                    }
                ]
            }
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
