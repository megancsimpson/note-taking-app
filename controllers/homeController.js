exports.renderHome = (req, res) => {
  res.render('pages/home', {
    title: 'Home',
    user: req.user || null,
  });
};

exports.renderAbout = (req, res) => {
  res.render('pages/about', {
    title: 'About',
    user: req.user || null,
  });
};
