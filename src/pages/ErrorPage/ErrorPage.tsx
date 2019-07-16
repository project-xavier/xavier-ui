import React from 'react';
import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';
import {
    Bullseye,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    Title,
    TitleLevel,
    EmptyStateBody
} from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

interface StateToProps {}

interface DispatchToProps {}

interface Props extends StateToProps, DispatchToProps {
};

interface State {
};

class GettingStarted extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title={ 'Error' } />
                </PageHeader>
                <Main>
                    <Bullseye>
                        <EmptyState variant={ EmptyStateVariant.large }>
                            <EmptyStateIcon icon={ ErrorCircleOIcon } />
                            <Title headingLevel={ TitleLevel.h5 } size="lg">
                                Error
                            </Title>
                            <EmptyStateBody>
                                Something unexpected happend, please try again!
                            </EmptyStateBody>
                            <Link to={ '/reports' } className="pf-c-button pf-m-primary">Home</Link>
                        </EmptyState>
                    </Bullseye>
                </Main>
            </React.Fragment>
        );
    }
}

export default GettingStarted;
