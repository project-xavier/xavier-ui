import UploadFilesPage from './UploadFilesPage';

describe('UploadFilesPage', () => {
    it('expect to render ', () => {
        const wrapper = shallow(
            <UploadFilesPage></UploadFilesPage>
        );
        expect(wrapper).toMatchSnapshot();
    });
});
