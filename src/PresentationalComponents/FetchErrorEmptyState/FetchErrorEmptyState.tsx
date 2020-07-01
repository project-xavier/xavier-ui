import React from 'react';
import {
    Bullseye,
    EmptyState,
    EmptyStateIcon,
    Title,
    EmptyStateBody,
    Button,
    EmptyStateVariant
} from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons';

export interface FetchErrorEmptyStateProps {
    onRetry: () => void;
}

export const FetchErrorEmptyState: React.FC<FetchErrorEmptyStateProps> = ({ onRetry }) => {
    return (
        <Bullseye>
            <EmptyState variant={EmptyStateVariant.large}>
                <EmptyStateIcon icon={ErrorCircleOIcon} />
                <Title headingLevel="h5" size="lg">
                    Error
                </Title>
                <EmptyStateBody>Something unexpected happend, please try again!</EmptyStateBody>
                <Button variant="primary" onClick={onRetry}>
                    Retry
                </Button>
            </EmptyState>
        </Bullseye>
    );
};
