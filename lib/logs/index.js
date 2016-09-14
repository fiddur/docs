import pkg from '../../package.json';
import nconf from 'nconf';
import agent from 'auth0-instrumentation';

const env = nconf.get();

agent.init(pkg, env);

export default agent;
