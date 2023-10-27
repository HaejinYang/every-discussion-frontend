function isEmailValid(email: string) {
  if (email.length < 1) {
    return true;
  }

  // Regular expression for a basic email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  return emailRegex.test(email);
}

export { isEmailValid };
