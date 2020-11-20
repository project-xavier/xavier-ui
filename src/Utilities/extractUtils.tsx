export const extractFilenameFromContentDispositionHeaderValue = (disposition: string) => {
  let filename = '';
  if (disposition && disposition.indexOf('attachment') !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }

  return filename;
};

export const getFilenameWithoutExtensions = (filename: string) => {
  return filename.replace(/(\.[^/.]+)+$/, '');
};
