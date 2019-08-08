import React, { Component } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Bullseye
} from '@patternfly/react-core';

interface Props {
    title: any;
    children: any;
    skipBullseye?: boolean;
    cardClass?: any;
    headerClass?: any;
    bodyClass?: any;
}

interface State {
}

class ReportCard extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
        const {
            title,
            children,
            skipBullseye,
            cardClass,
            headerClass,
            bodyClass
        } = this.props;

        return (
            <React.Fragment>
                <Card className={ cardClass }>
                    <CardHeader className={ headerClass }>
                        { title }
                    </CardHeader>
                    <CardBody className={ bodyClass }>
                        {
                            skipBullseye ?
                                (
                                    <React.Fragment>
                                        { children }
                                    </React.Fragment>
                                ) :
                                (
                                    <Bullseye>
                                        { children }
                                    </Bullseye>
                                )
                        }
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

export default ReportCard;
