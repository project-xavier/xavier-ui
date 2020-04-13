import React from 'react';
import { Link } from 'react-router-dom';
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
import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';

interface StateToProps {}

interface DispatchToProps {}

interface Props extends StateToProps, DispatchToProps {
};

interface State {
};

class ErrorPage extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public render() {
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
                                Something unexpected happened, please try again!
                            </EmptyStateBody>
                            <Link to={ '/' } className="pf-c-button pf-m-primary" target="_self">Home</Link>
                        </EmptyState>
                    </Bullseye>
                </Main>
            </React.Fragment>
        );
    }
}

export default ErrorPage;
