import React, { Component } from 'react';
import {
    Chart,
    ChartBar,
    ChartAxis,
    ChartProps,
    ChartBarProps,
    ChartGroup,
    ChartGroupProps
} from '@patternfly/react-charts';

export interface FancyGroupedBarChartData {
    colors: string[];
    values: {
        x: string,
        y: number
    }[][];
}

interface Props {
    data: FancyGroupedBarChartData;
    chartProps?: ChartProps;
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

class FancyBarChart extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const {
            data,
            chartProps,
            chartGroupProps,
            chartBarProps,
            tickFormat,
            footer
        } = this.props;

        return (
            <React.Fragment>
                <div className="bar-chart-container">
                    <Chart
                        { ...chartProps }
                    >
                        <ChartAxis
                            dependentAxis={ false }
                            tickFormat={ tickFormat && tickFormat.x ? tickFormat.x : (tick: any) => tick }
                            style={ {
                                tickLabels: { angle: -45, padding: 1, textAnchor: 'end' }
                            } }
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
                                        { ...chartBarProps }
                                    />
                                );
                            }) }
                        </ChartGroup>
                    </Chart>
                    { footer }
                </div>
            </React.Fragment>
        );
    }
}

export default FancyBarChart;
