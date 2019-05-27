import ReportListPage from './ReportListPage';

describe('ReportListPage', () => {
    it('expect to render ', () => {
        const wrapper = shallow(
            <ReportListPage></ReportListPage>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
