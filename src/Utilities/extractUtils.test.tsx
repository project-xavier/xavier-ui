import { getFilenameWithoutExtensions } from './extractUtils';

describe('Utils', () => {
  it('expect to remove .zip extension', () => {
    const filename = 'myFilename.zip';
    const filenameWithoutExtension = getFilenameWithoutExtensions(filename);
    expect(filenameWithoutExtension).toEqual('myFilename');
  });

  it('expect to remove .tar.gz extension', () => {
    const filename = 'myFilename.tar.gz';
    const filenameWithoutExtension = getFilenameWithoutExtensions(filename);
    expect(filenameWithoutExtension).toEqual('myFilename');
  });

  it('expect to remove any extension', () => {
    const filename = 'myFilename.extension1.extension2';
    const filenameWithoutExtension = getFilenameWithoutExtensions(filename);
    expect(filenameWithoutExtension).toEqual('myFilename');
  });
});
