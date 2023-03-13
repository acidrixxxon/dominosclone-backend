

class ApiError extends Error {
  status;
  errors;

  constructor(status,message,success = false,errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.success = success;
  }

  static UnathorizedError() {
    return new ApiError(401,'Користувач не авторизован!')
  }

  static BadRequest(message,errors = []) {
    return new ApiError(400,message,errors)
  }

  static BadActivationLink() {
    return new ApiError(500,'Не валідний лінк активації профілю!')
  }

  static UserAccountNotActivated() {
    return new ApiError(500,'Ваш аккаунт не активований. Перейдіть на пошту та активуйте його!')
  }

  static MissingUserToken(){
    return new ApiError(500,'Відсутній токен користувача')
  }
}

export default ApiError