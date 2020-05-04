import React, { Component } from 'react';
import {
    ChartDonut,
    ChartDonutProps,
    ChartThemeColor,
    ChartThemeVariant,
    ChartTooltip
} from '@patternfly/react-charts';

export interface FancyChartDonutData {
    label: string;
    value: number;
    color?: string;
    extraData?: any;
}

interface Props {
    data: FancyChartDonutData[];
    chartProps?: ChartDonutProps;
    tickFormat?: (label: string, value: number, data: any) => string;
    tooltipFormat?: (datum: any, active: boolean) => string;
}

interface State {
}

class FancyChartDonut extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        const { data, chartProps, tickFormat, tooltipFormat } = this.props;

        const chartData = data.map((val) => {
            return {
                x: val.label,
                y: val.value,
                extraData: val.extraData
            };
        });

        const legendData = data.map((val) => {
            return {
                name: tickFormat ? tickFormat (val.label, val.value, val.extraData) : `${val.label}: ${val.value}`
            };
        });

        const chartLabels = ({datum}): string => {
            return tickFormat ? tickFormat(datum.x, datum.y, datum.extraData) : `${datum.x}: ${datum.y}`;
        };

        return (
            <React.Fragment>
                <div className="pf-u-display-flex">
                    <div className="donut-chart-container">
                    <ChartDonut
                        constrainToVisibleArea={true}
                        data={ chartData }
                        labels={ chartLabels }
                        labelComponent={  <ChartTooltip text={ tooltipFormat ? tooltipFormat : undefined }/> }
                        legendData={ legendData }
                        legendOrientation="vertical"
                        legendPosition="right"
                        themeColor={ChartThemeColor.multiOrdered}
                        themeVariant={ChartThemeVariant.light}
                        padding={{
                            bottom: 20,
                            left: 20,
                            right: 140, // Adjusted to accommodate legend
                            top: 20
                        }}
                        width={550}
                        { ...chartProps }
                    />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default FancyChartDonut;
