import React, { Component } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Bullseye
} from '@patternfly/react-core';
import {
    Skeleton
} from '@redhat-cloud-services/frontend-components';

interface Props {
    title: string;
    loading: boolean;
    loadingSkeleton: any;
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

    render() {
        const {
            title,
            loading,
            loadingSkeleton,
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
                        { loading ? <Skeleton size="md"/> : title }
                    </CardHeader>
                    <CardBody className={ bodyClass }>
                        {
                            skipBullseye ?
                                (
                                    <React.Fragment>
                                        { loading ? loadingSkeleton : children }
                                    </React.Fragment>
                                ) :
                                (
                                    <Bullseye>
                                        { loading ? loadingSkeleton : children }
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
