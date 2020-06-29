import React from 'react';
import { Bullseye, Grid, GridItem } from '@patternfly/react-core';
import ReportCard from '../../ReportCard';
import { ReportWorkloadSummary, ApplicationPlatformModel } from '../../../models';
import FancyChartDonut from '../../FancyChartDonut';
import { FancyChartDonutData } from '../../FancyChartDonut/FancyChartDonut';
import { formatNumber, formatPercentage } from '../../../Utilities/formatValue';
import { EmptyCard } from '../../EmptyCard';
import { SolidCard } from '../../../PresentationalComponents/SolidCard';

interface Props {
    reportWorkloadSummary: ReportWorkloadSummary | null;
}

export const ApplicationPlatformsCard: React.FC<Props> = ({ reportWorkloadSummary }) => {
    const title = 'Application server platform information';

    if (
        !reportWorkloadSummary ||
        !reportWorkloadSummary.applicationPlatforms ||
        reportWorkloadSummary.applicationPlatforms.length === 0
    ) {
        return (
            <EmptyCard
                cardTitle={title}
                message="No application server platforms found"
                description="No application server platforms have been discovered."
            />
        );
    }

    const applicationPlatforms = reportWorkloadSummary.applicationPlatforms;

    const orderedApplicationPlatforms = applicationPlatforms.sort(
        (a: ApplicationPlatformModel, b: ApplicationPlatformModel) => {
            return a.name.localeCompare(b.name);
        }
    );

    //
    const pieValues = orderedApplicationPlatforms.map(element => element.total);

    const total = pieValues.reduce((a: number, b: number) => a + b, 0);
    const percentages = pieValues.map((val: number) => val / total);

    const chartProps = {
        title: formatNumber(total, 0),
        subTitle: 'Total'
    };

    const chartData: FancyChartDonutData[] = orderedApplicationPlatforms.map((element, index: number) => ({
        label: `${element.name}`,
        value: percentages[index],
        extraData: pieValues[index]
    }));

    const tickFormat = (label: string, value: number, data: any) => {
        return `${label}: ${data}`;
    };
    const tooltipFormat = ({ datum }) =>
        `${datum.x}: ${formatPercentage(datum.y, 2)} \n Total: ${formatNumber(datum.extraData, 0)}`;

    return (
        <ReportCard title={title} skipBullseye={true}>
            <Grid gutter="sm" xl={6}>
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
                            title={`Application server environments that can be replatformed with JBoss EAP: ${reportWorkloadSummary.recommendedTargetsIMSModel.jbosseap || 0}`}
                            // description="App platforms that can be replatformed with JBoss EAP"
                            width={510}
                        />
                    </Bullseye>
                </GridItem>
            </Grid>
        </ReportCard>
    );
};
