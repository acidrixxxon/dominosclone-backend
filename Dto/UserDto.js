



class UserDto {
  email;
  _id;
  confirmed;
  phone;
  firstName;
  secondName;
  isAdmin;

  constructor(data) {
    this._id = data._id;
    this.email = data.email;
    this.confirmed = data.confirmed;
    this.phone = data.phone;
    this.firstName = data.firstName;
    this.secondName = data.secondName;
    this.isAdmin = data.isAdmin;
  }
}

export default UserDto