interface IRandomStringOpts {
  numbers?: boolean;
  lettersAndNumbers?: boolean;
  symbols?: boolean;
}
function getRandomString(length: number, opts?: IRandomStringOpts) {
  opts = opts || {};

  const l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const n = '01234567890';
  const s = '!@#$%^&*()}{[]"|';
  const ln = l + n;

  if (opts.numbers) {
    return Array.from({length}).map(() => n.charAt(Math.floor(Math.random() * n.length))).join('');
  }
  if (opts.lettersAndNumbers) {
    return Array.from({length}).map(() => ln.charAt(Math.floor(Math.random() * ln.length))).join('');
  }
  if (opts.symbols) {
    Array.from({length}).map(() => s.charAt(Math.floor(Math.random() * s.length))).join('');
  }

  return Array.from({length}).map(() => l.charAt(Math.floor(Math.random() * l.length))).join('');
}

export {
  getRandomString
}
