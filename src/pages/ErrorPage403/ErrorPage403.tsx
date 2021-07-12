import React from 'react';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import {
    Bullseye,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    Title,
    TitleLevel,
    EmptyStateBody
} from '@patternfly/react-core';
import { PrivateIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

interface StateToProps {}

interface DispatchToProps {}

interface Props extends StateToProps, DispatchToProps {}

interface State {}

class ErrorPage403 extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title={'Error: 403 Forbidden'} />
                </PageHeader>
                <Main>
                    <Bullseye>
                        <EmptyState variant={EmptyStateVariant.large}>
                            <EmptyStateIcon icon={PrivateIcon} />
                            <Title headingLevel={TitleLevel.h5} size="lg">
                                Error: 403 Forbidden
                            </Title>
                            <EmptyStateBody>You tried to access a forbidden resource!.</EmptyStateBody>
                            <Link to={'/'} className="pf-c-button pf-m-primary" target="_self">
                                Home
                            </Link>
                        </EmptyState>
                    </Bullseye>
                </Main>
            </React.Fragment>
        );
    }
}

export default ErrorPage403;
