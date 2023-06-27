const { exec } = require('child_process');
console.log('running "npm outdated"');
const RUNNABLE_STRING = 'npm outdated';
const MAJOR = 'major';
const MINOR = 'minor';
const PATCH = 'patch';
let summaryObj = {
  major: [],
  minor: [],
  patch: [],
};

function majorMinorOrPatch(obj) {
  const { current, wanted, available } = obj;
  const currentVArr = current.split('.').map((d) => Number(d));
  const wantedVArr = wanted.split('.').map(d => Number(d));
  const availableVArr = available.split('.').map((d) => Number(d));
  
  if (availableVArr[0] > currentVArr[0]) return MAJOR;
  if (availableVArr[1] > currentVArr[1]) return MINOR;
  if (availableVArr[2] > currentVArr[2]) return PATCH;
}

function parseStdout(str) {
  str
    .toString()
    .split('\n')
    .forEach((line, idx) => {
      if (idx === 0) return;
        let thisMod = {
          name: '',
          current: '',
          wanted: '',
          available: '',
        };
        
      if (line.length > 0) { 
        line
          .split(/(\s+)/)
          .filter((d) => /[A-Za-z0-9]/.test(d))
          .forEach((section, sectionIdx) => {
            if ([4, 5].includes(sectionIdx)) return;
            if (sectionIdx === 0) {
              thisMod.name = section;
            }
            if (sectionIdx === 1) {
              thisMod.current = section;
            }
            if (sectionIdx === 2) {
              thisMod.wanted = section;
            }
            if (sectionIdx === 3) {
              thisMod.available = section;
            }
          });

        thisMod.semVerNeeded = majorMinorOrPatch(thisMod);
        summaryObj[thisMod.semVerNeeded].push(thisMod);
      }
    });
  const resultObj = {
    major: {
      count: summaryObj.major.length,
      packages: summaryObj.major.map(d => d.name).join(', ')
    },
    minor: {
      count: summaryObj.minor.length,
      packages: summaryObj.minor.map(d => d.name).join(', ')
    },
    patch: {
      count: summaryObj.patch.length,
      packages: summaryObj.patch.map(d => d.name).join(', ')
    },
  };
  console.table(resultObj);
  // console.log('summaryObj')
  // console.log(summaryObj)
}

function handleResponse(error, stdout, stderr) {
  parseStdout(stdout);
  if (stderr !== null && stderr !== undefined && stderr !== '') { 
    console.log('stderr:');
    console.log(stderr);
  }

  if (error !== null && !error.message.includes('Command failed: npm outdated')) {
    console.log(error.message);
  }
}

exec(RUNNABLE_STRING, handleResponse);