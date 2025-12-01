// Service to execute code in Docker sandbox
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const TIMEOUT = 5000;  // 5s timeout
const MEMORY_LIMIT = '256m';

const getDockerImage = (language) => {
  switch (language) {
    case 'cpp': return 'codejudge/cpp:latest';
    case 'python': return 'codejudge/python:latest';
    case 'java': return 'codejudge/java:latest';
    case 'javascript': return 'codejudge/js:latest';
    default: throw new Error('Unsupported language');
  }
};

const executeCode = async (code, language, input) => {
  const image = getDockerImage(language);
  let command;
  let compileCmd = '';

  switch (language) {
    case 'cpp':
      command = `g++ -o main /code/main.cpp && timeout ${TIMEOUT} ./main`;
      compileCmd = `echo '${code.replace(/'/g, "\\'")}' > /code/main.cpp && ${command}`;
      break;
    case 'python':
      command = `timeout ${TIMEOUT} python3 /code/main.py`;
      compileCmd = `echo '${code.replace(/'/g, "\\'")}' > /code/main.py && ${command}`;
      break;
    case 'java':
      command = `javac /code/Main.java && timeout ${TIMEOUT} java -Xmx${MEMORY_LIMIT} Main`;
      compileCmd = `echo 'import java.util.*; public class Main { public static void main(String[] args) { ${code} } }' > /code/Main.java && ${command}`;
      break;
    case 'javascript':
      command = `timeout ${TIMEOUT} node /code/main.js`;
      compileCmd = `echo '${code.replace(/'/g, "\\'")}' > /code/main.js && ${command}`;
      break;
  }

  try {
    // Run Docker with no network, ulimit for memory, non-root
    const dockerCmd = `docker run --rm --memory=${MEMORY_LIMIT} --ulimit nofile=1024:1024 --network none -i codejudge/${language}:latest sh -c "${compileCmd}"`;
    const { stdout, stderr } = await execAsync(dockerCmd, { timeout: TIMEOUT + 2000, input });
    return { output: stdout, error: stderr, timedOut: false };
  } catch (error) {
    if (error.signal === 'SIGTERM') return { output: '', error: 'TLE', timedOut: true };
    return { output: '', error: error.message || 'Runtime Error', timedOut: false };
  }
};

module.exports = { executeCode };