function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function reportError(message: string) {
  // TODO: 적적한 에러 관리 시스템이 필요하다.
  console.error(message);
}

function throwErrorWhenResponseNotOk(response: Response) {
  if (!response.ok) {
    const errorMessage = `Network response was not ok: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
}

export { getErrorMessage, reportError, throwErrorWhenResponseNotOk };