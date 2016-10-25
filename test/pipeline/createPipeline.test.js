import '../../config';
import createPipeline from '../../lib/pipeline/createPipeline';

describe('createPipeline', function() {
  this.timeout(30000);

  it('works', (done) => {
    const pipeline = createPipeline();
    pipeline.on('ready', () => {
      console.log(Object.keys(pipeline.docsByPath).length);
      done();
    });
  });

});
