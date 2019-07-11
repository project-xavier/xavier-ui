import React, { Component } from 'react';
import {
    ChartDonut,
    ChartDonutProps,
    ChartLegend,
    ChartLegendProps
} from '@patternfly/react-charts';

interface Props {
    data: {
        label: string;
        value: number;
        color: string;
    }[];
    chartProps?: ChartDonutProps;
    chartLegendProps?: ChartLegendProps;
}

interface State {
}

class FancyChartDonut extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const { data, chartProps, chartLegendProps } = this.props;

        const chartData = data.map((val) => {
            return {
                x: val.label,
                y: val.value
            };
        });

        const legendData = data.map((val) => {
            return {
                name: `${val.label}: ${val.value.toFixed(2)}%`
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
                            labels={ datum => `${datum.x}: ${datum.y.toFixed(2)}%` }
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
