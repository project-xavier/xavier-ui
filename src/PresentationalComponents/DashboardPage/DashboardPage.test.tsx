import DashboardPage from './DashboardPage';

describe('DashboardPage', () => {
    it('expect to render ', () => {
        const wrapper = shallow(
            <DashboardPage></DashboardPage>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
