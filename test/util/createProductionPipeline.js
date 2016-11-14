import createPipeline from '../../lib/pipeline/createPipeline';
import '../../config';

let pipeline;

/**
 * Lazily instantiates a singleton instance of the real compilation pipeline
 * used in production. The pipeline will be allowed to gather and compile
 * documents, and then the callback will be called when ready. If the pipeline
 * has already been initialized, the callback will be called immediately.
 * @param {Function} callback - The function to call when the pipeline is ready.
 */
export default function createProductionPipeline(callback) {
  if (!pipeline) {
    try {
      pipeline = createPipeline();
    } catch (err) {
      callback(err);
      return;
    }
  }
  pipeline.whenReady(() => callback(null, pipeline));
}
