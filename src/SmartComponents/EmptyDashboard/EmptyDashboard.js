import React from 'react';
import { Link } from 'react-router-dom';
import {
    Title,
    Button,
    EmptyState,
    EmptyStateIcon,
    EmptyStateBody
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Bullseye } from '@patternfly/react-core';
import { Card, CardBody } from '@patternfly/react-core';

const EmptyDashboard = () => {
    return (
        <Card>
            <CardBody>
                <Bullseye>
                    <EmptyState>
                        <EmptyStateIcon icon={ CubesIcon } />
                        <Title headingLevel="h5" size="lg">
                            No Uploads
                        </Title>
                        <EmptyStateBody>
                            You have not uploaded any file yet.
                        </EmptyStateBody>
                        <Link to="/upload">
                            <Button variant="primary">Upload</Button>
                        </Link>
                    </EmptyState>
                </Bullseye>
            </CardBody>
        </Card >
    );
};

export default EmptyDashboard;
