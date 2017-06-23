module.exports = fun => {
  return arg => {
    return new Promise((resolve, reject) => {
      fun(arg, (error, data) => {
        if (error) return reject(error);
        resolve(data);
      })
    });
  }
};
