import PropTypes from 'prop-types';

export const LoadingState = ({ loading, placeholder, children }) =>
    loading ? placeholder : children;

LoadingState.propTypes = {
    placeholder: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    loading: PropTypes.bool // Is assumed to be false if undefined
};

export default LoadingState;
