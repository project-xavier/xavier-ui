import React, { Component } from 'react';
import {
    ChartLegend,
    Chart,
    ChartGroup,
    ChartBar,
    ChartLegendProps,
    ChartProps,
    ChartGroupProps,
    ChartBarProps,
    ChartAxis,
    ChartTooltip
} from '@patternfly/react-charts';
import './FancyGroupedBarChart.scss';

export interface FancyGroupedBarChartData {
    colors: string[];
    labels?: string[];
    values: {
        x: string,
        y: number,
        label?: string
    }[][];
}

interface Props {
    data: FancyGroupedBarChartData;
    chartProps?: ChartProps;
    legendProps?: ChartLegendProps;
    chartGroupProps?: ChartGroupProps;
    chartBarProps?: ChartBarProps;
    tickFormat?: {
        x?: any[] | ((tick: any, index: number, ticks: any[]) => string | number),
        y?: any[] | ((tick: any, index: number, ticks: any[]) => string | number)
    };
    footer?: any;
}

interface State {
}

class FancyGroupedBarChart extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const {
            data,
            chartProps,
            legendProps,
            chartGroupProps,
            chartBarProps,
            tickFormat,
            footer
        } = this.props;

        let legendData;
        if (data.labels) {
            legendData = data.labels.map((value) => ({ name: value }));
        } else {
            legendData = data.values.map((value) => ({ name: value[0].x }));
        }

        return (
            <React.Fragment>
                <div className="bar-chart-container">
                    <ChartLegend
                        data={ legendData }
                        colorScale={ data.colors }
                        orientation={ 'horizontal' }
                        style={ { labels: { fontSize: 12 }} }
                        { ...legendProps }
                    />
                    <Chart
                        { ...chartProps }
                    >
                        <ChartAxis
                            dependentAxis={ false }
                            tickFormat={ tickFormat && tickFormat.x ? tickFormat.x : (tick: any) => tick }
                        />
                        <ChartAxis
                            dependentAxis={ true }
                            showGrid={ true }
                            tickFormat={ tickFormat && tickFormat.y ? tickFormat.y : (tick: any) => tick }
                            style={ {
                                axis: { stroke: 'none' }
                            } }
                            tickCount={ 6 }
                        />
                        <ChartGroup
                            colorScale={ data.colors }
                            { ...chartGroupProps }
                        >
                            { data.values.map((value, index: number) => {
                                return (
                                    <ChartBar
                                        key={ index }
                                        data={ value }
                                        labelComponent={ <ChartTooltip style={ { color: 'white' } }/> }
                                        { ...chartBarProps }
                                    />
                                );
                            }) }
                        </ChartGroup>
                    </Chart>
                    {
                        footer &&
                        <div className="chart-footer">
                            { footer }
                        </div>
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default FancyGroupedBarChart;
