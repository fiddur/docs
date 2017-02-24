export default function getQuickstartDocumentUrl(quickstarts, params, isFramedMode = false) {
  const quickstartId = params.quickstart ? params.quickstart.name : params.quickstartId;
  const platformId = params.platform ? params.platform.name : params.platformId;
  const versionId = params.versionId;
  let articleId = params.article ? params.article.name : params.articleId;

  if (quickstartId && platformId && !articleId) {
    const platform = quickstarts[quickstartId].platforms[platformId];
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
