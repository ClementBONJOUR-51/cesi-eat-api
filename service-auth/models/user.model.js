// model user
const User = function(user) {
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.gender = user.gender;
    this.birthday = user.birthday;
    this.email = user.email;
    this.password = user.password;
    this.token = user.token;
    this.phone = user.phone;
    this.date_in = user.date_in;
    this.date_out = user.date_out;
    this.email_sponsor = user.email_sponsor;
    this.id_role = user.id_role;
    this.id_address = user.id_address;
};

module.exports = User;