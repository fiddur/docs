export default function getQuickstartDocumentUrl(quickstarts, params, isFramedMode = false) {
  const quickstartId = params.quickstart ? params.quickstart.name : params.quickstartId;
  const platformId = params.platform ? params.platform.name : params.platformId;
  const versionId = params.versionId;
  let articleId = params.article ? params.article.name : params.articleId;

  if (quickstartId && platformId && !articleId) {
    const quickstart = quickstarts[quickstartId];
    if (!quickstart) {
      const err = new Error(`No such app type ${quickstartId} exists.`);
      err.statusCode = 404;
      throw err;
    }
    const platform = quickstart.platforms[platformId];
    if (!platform) {
      const err = Error(`No such platform ${platformId} exists in the app type ${quickstartId}.`);
      err.statusCode = 404;
      throw err;
    }
    if (isFramedMode && platform.defaultArticle) {
      articleId = platform.defaultArticle.name;
    } else {
      articleId = platform.articles[0].name;
    }
  }

  const tokens = ['/docs', 'quickstart'];
  if (quickstartId) tokens.push(quickstartId);
  if (platformId) tokens.push(platformId);
  if (versionId) tokens.push(versionId);
  if (articleId) tokens.push(articleId);

  return tokens.join('/');
}
