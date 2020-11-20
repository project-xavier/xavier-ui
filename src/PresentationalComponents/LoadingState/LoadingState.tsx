interface Props {
  placeholder: any;
  children: any;
  loading?: boolean; // Is assumed to be false if undefined
}

export const LoadingState = ({ loading, placeholder, children }: Props) =>
  loading ? placeholder : children;

export default LoadingState;
