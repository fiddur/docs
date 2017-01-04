import { parse } from 'url';
import metrics from '../browser/metrics';

const getClientId = (user) => {
  if (user && user.account && user.account.clientId !== 'YOUR_CLIENT_ID') {
    return user.account.clientId;
  }

  const url = parse(document.location.toString(), true);
  if (url.query.a) {
    return url.query.a;
  }

  return '';
};

const createEventData = (props) => {
  const { isFramedMode, quickstart, platform, article, user } = props;
  return {
    label: isFramedMode ? 'docs-framed' : 'docs-standalone',
    clientID: getClientId(user),
    'tutorial-apptype': quickstart ? quickstart.name : '',
    'tutorial-platform': platform ? platform.name : '',
    'tutorial-article': article ? article.name : ''
  };
};

export const sendTutorialViewedEvent = (props) => {
  metrics.track('view:tutorial', createEventData(props));
};

export const sendPackageDownloadEvent = (props) => {
  metrics.track('download:tutorial-seed', createEventData(props));
};
