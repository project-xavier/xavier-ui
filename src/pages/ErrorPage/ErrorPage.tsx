import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bullseye,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
} from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';

class ErrorPage extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <PageHeader>
          <PageHeaderTitle title={'Error'} />
        </PageHeader>
        <Main>
          <Bullseye>
            <EmptyState variant={EmptyStateVariant.large}>
              <EmptyStateIcon icon={ErrorCircleOIcon} />
              <Title headingLevel="h5" size="lg">
                Error
              </Title>
              <EmptyStateBody>Something unexpected happened, please try again!</EmptyStateBody>
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

export default ErrorPage;
