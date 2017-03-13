export default function getQuickstartDocumentUrl(quickstarts, params, isFramedMode = false) {
  const quickstartId = params.quickstart ? params.quickstart.name : params.quickstartId;
  const platformId = params.platform ? params.platform.name : params.platformId;
  const versionId = params.versionId;
  let articleId = params.article ? params.article.name : params.articleId;

  if (quickstartId && platformId && !articleId) {
    const quickstart = quickstarts[quickstartId];
    if (!quickstart) {
      throw new Error(`No such app type ${quickstartId} exists.`);
    }
    const platform = quickstart.platforms[platformId];
    if (!platform) {
      throw new Error(`No such platform ${platformId} exists in the app type ${quickstartId}.`);
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
