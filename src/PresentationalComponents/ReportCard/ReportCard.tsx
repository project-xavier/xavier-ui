import React, { Component } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    Bullseye
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Card/card';
import titleStyles from '@patternfly/react-styles/css/components/Title/title';

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
                    <div className={css(styles.cardHeader, titleStyles.title, titleStyles.modifiers.xl, headerClass)}>
                        { title }
                    </div>
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
