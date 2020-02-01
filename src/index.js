const dummyFn = () => 'DummyFn String';
let mockObj = {
	a: 'aString'
}
let otherObj = {b : 'bString'}
console.log('This is the beginning of a frontend build system');
console.log(dummyFn());
console.log(JSON.stringify({...mockObj, ...otherObj}));