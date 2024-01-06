function isEmailValid(email: string) {
  if (email.length < 1) {
    return true;
  }

  // Regular expression for a basic email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  return emailRegex.test(email);
}

function isNameVaild(name: string) {
  if (name.length < 1) {
    return true;
  }

  // Regular expression for a basic email validation
  const reg = /^[A-Za-z0-9가-힣.]{1,20}$/;

  return reg.test(name);
}

export { isEmailValid, isNameVaild };
