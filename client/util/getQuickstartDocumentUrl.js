export default function getQuickstartDocumentUrl(quickstarts, payload) {
  let { quickstartId, platformId, articleId, isFramedMode } = payload;

  if (quickstartId && platformId && !articleId) {
    const platform = quickstarts[quickstartId].platforms[platformId];
    if (isFramedMode && platform.defaultArticle) {
      articleId = platform.defaultArticle.name;
    } else {
      articleId = platform.articles[0].name;
    }
  }

  const tokens = ['/docs'];
  if (quickstartId) tokens.push(quickstarts[quickstartId].slug);
  if (platformId) tokens.push(platformId);
  if (articleId) tokens.push(articleId);

  return tokens.join('/');
}
