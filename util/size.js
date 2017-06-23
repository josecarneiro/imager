exports.format = size => {
  if (size instanceof Array) {
    if (size.length !== 2) return false;
    if (typeof size[0] === 'string' || typeof size[1] === 'string') {
      size[0] = parseInt(size[0], 10);
      size[1] = parseInt(size[1], 10);
    }
  } else {
    if (typeof size === 'number') {
      size = [ size, size ];
    } else if (typeof size === 'string') {
      let number = parseInt(size, 10);
      size = [ number, number ];
    } else {
      return false;
    }
  }
  // CHECK SIZE IS APPROPRIATE
  if (size[0] < 1 || size[0] > 2000 || size[1] < 1 || size[1] > 2000) return false;
  return size;
};
