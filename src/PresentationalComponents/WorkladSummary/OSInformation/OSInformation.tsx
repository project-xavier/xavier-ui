import React from 'react';
import { Bullseye, Grid, GridItem, Tooltip } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';

import ReportCard from '../../ReportCard';
import { ReportWorkloadSummary, OSInformationModel } from '../../../models';
import FancyChartDonut from '../../FancyChartDonut';
import { FancyChartDonutData } from '../../FancyChartDonut/FancyChartDonut';
import { formatNumber, formatPercentage } from '../../../Utilities/formatValue';
import { EmptyCard } from '../../EmptyCard';
import { SolidCard } from '../../SolidCard';

interface Props {
    reportWorkloadSummary: ReportWorkloadSummary | null;
}

export const OSInformation: React.FC<Props> = ({ reportWorkloadSummary }) => {
    const title = (
        <span>
            <span>Operating system information</span>&nbsp;
            <span>
                <Tooltip position="top" content={<div>See the Workload migration inventory for details</div>}>
                    <HelpIcon />
                </Tooltip>
            </span>
        </span>
    );

    if (
        !reportWorkloadSummary ||
        !reportWorkloadSummary.osInformation ||
        reportWorkloadSummary.osInformation.length === 0
    ) {
        return (
            <EmptyCard
                cardTitle={title}
                message="Not enough data"
                description="Could not extract operating system information."
            />
        );
    }

    const osInformation = reportWorkloadSummary.osInformation;

    const orderedOsInformation = osInformation.sort((a: OSInformationModel, b: OSInformationModel) => {
        if (a.osFamily === b.osFamily) {
            return (Number(b.version) || 0) - (Number(a.version) || 0);
        } else if (a.priority || b.priority) {
            return (b.priority || 0) - (a.priority || 0);
        }
        return b.osFamily.localeCompare(a.osFamily);
    });

    //
    const pieValues = orderedOsInformation.map(element => element.total);

    const total = pieValues.reduce((a: number, b: number) => a + b, 0);
    const percentages = pieValues.map((val: number) => val / total);

    const chartProps = {
        title: formatNumber(total, 0),
        subTitle: 'Total',
        padding: {
            bottom: 20,
            left: 20,
            right: 165, // Adjusted to accommodate legend
            top: 20
        }
    };

    const chartData: FancyChartDonutData[] = orderedOsInformation.map((element, index: number) => ({
        label: `${element.osFamily}`,
        value: percentages[index],
        extraData: pieValues[index]
    }));

    const tickFormat = (label: string, value: number, data: any) => {
        return `${label}: ${formatNumber(data, 0)}`;
    };
    const tooltipFormat = ({ datum }) =>
        `${datum.x}: ${formatPercentage(datum.y, 2)} \n Total: ${formatNumber(datum.extraData, 0)}`;

    return (
        <ReportCard title={title} skipBullseye={true}>
            <Grid hasGutter={true} xl={6}>
                <GridItem>
                    <Bullseye>
                        <FancyChartDonut
                            data={chartData}
                            chartProps={chartProps}
                            tickFormat={tickFormat}
                            tooltipFormat={tooltipFormat}
                        />
                    </Bullseye>
                </GridItem>
                <GridItem>
                    <Bullseye>
                        <SolidCard
                            title={`Operating systems that can be migrated to Red Hat Enterprise Linux: ${formatNumber(
                                reportWorkloadSummary.recommendedTargetsIMSModel.rhel || 0,
                                0
                            )}`}
                            width={510}
                        />
                    </Bullseye>
                </GridItem>
            </Grid>
        </ReportCard>
    );
};
