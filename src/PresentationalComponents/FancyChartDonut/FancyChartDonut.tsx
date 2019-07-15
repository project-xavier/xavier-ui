import React, { Component } from 'react';
import {
    ChartDonut,
    ChartDonutProps,
    ChartLegend,
    ChartLegendProps
} from '@patternfly/react-charts';

export interface FancyChartDonutData {
    label: string;
    value: number;
    color: string;
}

interface Props {
    data: FancyChartDonutData[];
    chartProps?: ChartDonutProps;
    chartLegendProps?: ChartLegendProps;
    tickFormat?: (label: string, value: number) => string;
}

interface State {
}

class FancyChartDonut extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const { data, chartProps, chartLegendProps, tickFormat } = this.props;

        const chartData = data.map((val) => {
            return {
                x: val.label,
                y: val.value
            };
        });

        const legendData = data.map((val) => {
            return {
                name: tickFormat ? tickFormat (val.label, val.value) : `${val.label}: ${val.value}`
            };
        });

        const colorScale = data.map((val) => val.color);

        return (
            <React.Fragment>
                <div className="pf-u-display-flex">
                    <div className="donut-chart-container">
                        <ChartDonut
                            data={ chartData }
                            colorScale={ colorScale }
                            labels={ datum => tickFormat ? tickFormat(datum.x, datum.y) : `${datum.x}: ${datum.y}` }
                            { ...chartProps }
                        />
                    </div>
                    <ChartLegend
                        data={ legendData }
                        colorScale={ colorScale }
                        orientation="vertical"
                        { ...chartLegendProps }
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default FancyChartDonut;
