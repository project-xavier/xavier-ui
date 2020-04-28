import React from 'react';
import { Stack, StackItem, Divider, Bullseye } from '@patternfly/react-core';
import { BullseyeIcon } from '@patternfly/react-icons';
import ReportCard from '../../ReportCard';
import { ReportWorkloadSummary, JavaRuntimeModel } from 'src/models';
import FancyChartDonut from '../../FancyChartDonut';
import { FancyChartDonutData } from '../../FancyChartDonut/FancyChartDonut';
import { formatNumber, formatPercentage } from '../../../Utilities/formatValue';
import { EmptyCard } from '../../EmptyCard';

interface Props {
    reportWorkloadSummary: ReportWorkloadSummary | null;
}

export const JavaRuntimesCard: React.FC<Props> = ({ reportWorkloadSummary }) => {
    const title = 'Oracle Java runtimes information';

    if (!reportWorkloadSummary) {
        return <EmptyCard title={title} />;
    }

    const javaRuntimes = reportWorkloadSummary.javaRuntimes;
    if (!javaRuntimes || javaRuntimes.length === 0) {
        return <EmptyCard title={title} />;
    }

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
        subTitle: 'Total',
        height: 270,
        width: 300
    };
    const chartLegendProps = {
        height: 200,
        width: 210,
        responsive: false,
        y: 60
    };

    const chartData: FancyChartDonutData[] = orderedJavaRuntimes.map((element, index: number) => ({
        label: element.vendor + ' ' + element.version,
        value: percentages[index],
        extraData: pieValues[index]
    }));

    const tickFormat = (label: string, value: number, data: any) => {
        return `${label}: ${data}`;
    };
    const tooltipFormat = ({ datum }) =>
        `${datum.x}: ${formatPercentage(datum.y, 2)} \n Runtimes: ${formatNumber(datum.extraData, 0)}`;

    return (
        <ReportCard title={title} skipBullseye={true}>
            <Stack>
                <StackItem>
                    <div className="pf-c-content">
                        <h5>
                            <i>
                                <BullseyeIcon />
                            </i>{' '}
                            {total} Oracle JDKs can be replaced with OpenJDK
                        </h5>
                        <br />
                        <Divider component="div" />
                    </div>
                </StackItem>
                <StackItem isFilled>
                    <Bullseye>
                        <FancyChartDonut
                            data={chartData}
                            chartProps={chartProps}
                            chartLegendProps={chartLegendProps}
                            tickFormat={tickFormat}
                            tooltipFormat={tooltipFormat}
                        />
                    </Bullseye>
                </StackItem>
            </Stack>
        </ReportCard>
    );
};
