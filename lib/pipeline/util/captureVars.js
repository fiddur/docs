import vm from 'vm';

const sandbox = {};
const captureContext = vm.createContext(sandbox);

export default function captureVars(str) {
  const code = `var vars = ${str};`;
  sandbox.vars = undefined;
  vm.runInContext(code, captureContext);
  return sandbox.vars;
}
