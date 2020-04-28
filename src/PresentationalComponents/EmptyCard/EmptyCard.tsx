import React from 'react';
import { Card, CardBody, Bullseye, EmptyState, EmptyStateVariant, EmptyStateIcon, Title } from '@patternfly/react-core';
import { InfoIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Card/card';
import titleStyles from '@patternfly/react-styles/css/components/Title/title';

interface Props {
    title: string | React.ReactElement;
    minHeight?: number;
}

export const EmptyCard: React.FC<Props> = ({ title, minHeight }) => {
    return (
        <Card>
            <div className={css(styles.cardHeader, titleStyles.title, titleStyles.modifiers.xl)}>{title}</div>
            <CardBody style={minHeight ? { height: minHeight } : undefined}>
                <Bullseye>
                    <EmptyState variant={EmptyStateVariant.full}>
                        <EmptyStateIcon icon={InfoIcon} />
                        <Title headingLevel="h6" size="lg">
                            Not enough data to show this card.
                        </Title>
                    </EmptyState>
                </Bullseye>
            </CardBody>
        </Card>
    );
};
