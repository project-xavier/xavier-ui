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
    ChartTooltip,
    ChartAxisProps
} from '@patternfly/react-charts';
import './FancyGroupedBarChart.scss';

export interface FancyGroupedBarChartData {
    colors: string[];
    legends?: string[];
    values: Array<Array<{
        x: string,
        y: number,
        label?: string
    }>>;
}

interface Props {
    data: FancyGroupedBarChartData;
    chartProps?: ChartProps;
    legendProps?: ChartLegendProps;
    chartGroupProps?: ChartGroupProps;
    chartBarProps?: ChartBarProps;
    dependentChartAxisProps?: ChartAxisProps;
    independentChartAxisProps?: ChartAxisProps;
    footer?: any;
}

interface State {
}

const baseLegendStyle = {
    labels: {
        fontSize: 12
    }
};

const baseDependentAxisStyle = {
    axis: { stroke: 'none' }
};

const baseIndependentAxisStyle = {
};

class FancyGroupedBarChart extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        const {
            data,
            chartProps,
            legendProps,
            chartGroupProps,
            chartBarProps,
            dependentChartAxisProps,
            independentChartAxisProps,
            footer
        } = this.props;

        const { style: legendStyle, ...restLegendProps } = legendProps || { style: { }};
        const { style: dependenAxisStyles, ...restDependentChartAxisProps } = dependentChartAxisProps || { style: { }};
        const { style: independenAxisStyles, ...restIndependentChartAxisProps } = independentChartAxisProps || { style: { }};

        return (
            <React.Fragment>
                <div className="bar-chart-container">
                    {
                        data.legends &&
                        <ChartLegend
                            data={ data.legends.map((value) => ({ name: value })) }
                            colorScale={ data.colors }
                            orientation={ 'horizontal' }
                            style={ Object.assign({ }, baseLegendStyle, legendStyle) }
                            { ...restLegendProps }
                        />
                    }
                    <Chart { ...chartProps }>
                        <ChartAxis
                            dependentAxis={ false }
                            style={ Object.assign({ }, baseIndependentAxisStyle, independenAxisStyles) }
                            { ...restIndependentChartAxisProps }
                        />
                        <ChartAxis
                            dependentAxis={ true }
                            showGrid={ true }
                            tickCount={ 6 }
                            style={ Object.assign({ }, baseDependentAxisStyle, dependenAxisStyles) }
                            { ...restDependentChartAxisProps }
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
                        footer && <div className="chart-footer">{ footer }</div>
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default FancyGroupedBarChart;
