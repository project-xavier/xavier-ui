import React, { Component } from 'react';
import {
    ChartDonut,
    ChartDonutProps,
    ChartLegend,
    ChartLegendProps,
    ChartThemeColor,
    ChartThemeVariant
} from '@patternfly/react-charts';

export interface FancyChartDonutData {
    label: string;
    value: number;
    color?: string;
    data?: any;
}

interface Props {
    data: FancyChartDonutData[];
    chartProps?: ChartDonutProps;
    chartLegendProps?: ChartLegendProps;
    tickFormat?: (label: string, value: number, data: any) => string;
}

interface State {
}

class FancyChartDonut extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        const { data, chartProps, chartLegendProps, tickFormat } = this.props;

        const chartData = data.map((val) => {
            return {
                x: val.label,
                y: val.value,
                data: val.data
            };
        });

        const legendData = data.map((val) => {
            return {
                name: tickFormat ? tickFormat (val.label, val.value, val.data) : `${val.label}: ${val.value}`
            };
        });

        const colorScale = !data.some((val) => !val.color) ? data.map((val) => val.color || '') : undefined;

        const chartLabels = (datum: any): string => {
            return tickFormat ? tickFormat(datum.x, datum.y, datum.data) : `${datum.x}: ${datum.y}`;
        };

        return (
            <React.Fragment>
                <div className="pf-u-display-flex">
                    <div className="donut-chart-container">
                        <ChartDonut
                            data={ chartData }
                            themeColor={colorScale ? undefined : ChartThemeColor.multiOrdered}
                            themeVariant={colorScale ? undefined : ChartThemeVariant.light}
                            colorScale={ colorScale }
                            labels={ chartLabels }
                            { ...chartProps }
                        />
                    </div>
                    <ChartLegend
                        data={ legendData }
                        colorScale={ colorScale }
                        themeColor={colorScale ? undefined : ChartThemeColor.multiOrdered}
                        themeVariant={colorScale ? undefined : ChartThemeVariant.light}
                        orientation="vertical"
                        { ...chartLegendProps }
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default FancyChartDonut;
