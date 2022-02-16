let getLoginRegister = (req, res) => {
  return res.render("auth/main");
};

module.exports = {
  getLoginRegister: getLoginRegister
}
