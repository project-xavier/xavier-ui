import React from 'react';
import { Card, CardBody } from '@patternfly/react-core';

interface Props {
    title: string;
    description: string;
    width?: number;
}

interface State {}

export class SolidCard extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        const { title, description, width } = this.props;

        return (
            <Card className="xa-c-card-solid" style={width ? { width: width } : undefined}>
                <CardBody>
                    <h2 className="pf-c-title pf-m-3xl">{title}</h2>
                    <p>{description}</p>
                </CardBody>
            </Card>
        );
    }
}
