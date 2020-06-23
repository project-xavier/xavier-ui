import React from 'react';
import { Bullseye, GridItem, Grid } from '@patternfly/react-core';
import ReportCard from '../../ReportCard';
import { ReportWorkloadSummary, JavaRuntimeModel } from '../../../models';
import FancyChartDonut from '../../FancyChartDonut';
import { FancyChartDonutData } from '../../FancyChartDonut/FancyChartDonut';
import { formatNumber, formatPercentage } from '../../../Utilities/formatValue';
import { EmptyCard } from '../../EmptyCard';
import { SolidCard } from '../../../PresentationalComponents/SolidCard';

interface Props {
    reportWorkloadSummary: ReportWorkloadSummary | null;
}

export const JavaRuntimesCard: React.FC<Props> = ({ reportWorkloadSummary }) => {
    const title = 'Oracle Java runtimes information';

    if (
        !reportWorkloadSummary ||
        !reportWorkloadSummary.javaRuntimes ||
        reportWorkloadSummary.javaRuntimes.length === 0
    ) {
        return (
            <EmptyCard
                cardTitle={title}
                message="No instances found"
                description="No instances of Oracle JDKs have been discovered."
            />
        );
    }

    const javaRuntimes = reportWorkloadSummary.javaRuntimes;

    const orderedJavaRuntimes = javaRuntimes.sort((a: JavaRuntimeModel, b: JavaRuntimeModel) => {
        if (a.vendor === b.vendor) {
            return Number(a.version) - Number(b.version);
        }
        return a.vendor.localeCompare(b.vendor);
    });

    //
    const pieValues = orderedJavaRuntimes.map(element => element.total);

    const total = pieValues.reduce((a: number, b: number) => a + b, 0);
    const percentages = pieValues.map((val: number) => val / total);

    const chartProps = {
        title: formatNumber(total, 0),
        subTitle: 'Total'
    };

    const chartData: FancyChartDonutData[] = orderedJavaRuntimes.map((element, index: number) => ({
        label: `${element.vendor} JDK ${element.version}`,
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
                            title={`${reportWorkloadSummary.recommendedTargetsIMSModel.openjdk || 0} OpenJDK`}
                            description="Oracle JDKs that can be replaced with OpenJDK"
                            width={510}
                        />
                    </Bullseye>                    
                </GridItem>
            </Grid>
        </ReportCard>
    );
};
