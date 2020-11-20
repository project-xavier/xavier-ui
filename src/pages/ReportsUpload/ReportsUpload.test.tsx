import React from 'react';
import { shallow } from 'enzyme';
import ReportsUpload, { Props } from './ReportsUpload';

const props: Props = {
  file: null,
  success: null,
  error: null,
  progress: 100,
  uploading: true,

  uploadProgress: jest.fn(),
  uploadRequest: jest.fn(),
  selectUploadFile: jest.fn(),
  resetUploadFile: jest.fn(),

  history: null,
  location: null,
  match: null,

  user: {
    firstTimeCreatingReports: false,
  },
  updateUser: jest.fn(),
};

describe('ReportsUpload', () => {
  it('expect to render form', () => {
    const wrapper = shallow(<ReportsUpload {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
