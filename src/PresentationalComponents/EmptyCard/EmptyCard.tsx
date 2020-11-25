import React from 'react';
import {
  Card,
  CardBody,
  Bullseye,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Card/card';
import titleStyles from '@patternfly/react-styles/css/components/Title/title';

interface Props {
  cardTitle: string | React.ReactElement;
  message: string;
  description?: string;
  minHeight?: number;
}

export const EmptyCard: React.FC<Props> = ({ cardTitle, message, description, minHeight }) => {
  return (
    <Card>
      <div className={css(styles.cardHeader, titleStyles.title, titleStyles.modifiers.xl)}>
        {cardTitle}
      </div>
      <CardBody style={minHeight ? { height: minHeight } : undefined}>
        <Bullseye>
          <EmptyState variant={EmptyStateVariant.small}>
            <EmptyStateIcon icon={SearchIcon} />
            <Title headingLevel="h6" size="lg">
              {message}
            </Title>
            {description && <EmptyStateBody>{description}</EmptyStateBody>}
          </EmptyState>
        </Bullseye>
      </CardBody>
    </Card>
  );
};
