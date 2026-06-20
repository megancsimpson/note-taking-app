exports.crash = (req, res) => {
  throw new Error('Something broke');
};
