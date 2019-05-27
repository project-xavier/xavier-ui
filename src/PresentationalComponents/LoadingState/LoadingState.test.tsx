import { LoadingState } from './LoadingState';

describe('LoadingState', () => {
    it('expect to render placeholder when loading', () => {
        const wrapper = shallow(
            <LoadingState placeholder="loading" loading={ true }>
                loaded
            </LoadingState>
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('expect to render children when loaded', () => {
        const wrapper = shallow(
            <LoadingState placeholder="loading" loading={ false }>
                loaded
            </LoadingState>
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('expect to render children when undefined', () => {
        const wrapper = shallow(
            <LoadingState placeholder="loading">
                loaded
            </LoadingState>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
