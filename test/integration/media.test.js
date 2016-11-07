import { expect } from 'chai';
import lsr from 'lsr';
import fs from 'fs';
import { extname, relative, resolve } from 'path';

describe('Media', function() {
  this.timeout(30000);

  const mediaDir = resolve(__dirname, '../../docs/media');
  const getMaxAllowedSize = (file) => {
    if (extname(file.name) === '.gif') return 5 * 1000 * 1000; // 5MB
    return 512 * 1000; // 512KB
  };

  it('should not include large media files', () => {
    lsr
    .sync(mediaDir)
    .filter(file => file.isFile())
    .forEach(file => {
      const maxSize = getMaxAllowedSize(file);
      expect(file.size).to.be.below(maxSize, `The size of image at ${file.fullPath} is too large`);
    });
  });

});
