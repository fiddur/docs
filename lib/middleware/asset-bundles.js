import { getAssetBundleUrl } from '../utils';

export default function assetBundles(req, res, next) {
  res.locals.getAssetBundleUrl = getAssetBundleUrl;
  next();
}
