import TinyError from '@/util/error/TinyError';

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

function throwErrorWhenResponseNotOk(response: Response, ignoreAuth = false) {
  if (!ignoreAuth && response.status === 401) {
    window.location.href = '/error/인증이 필요합니다';
  }

  if (!ignoreAuth && response.status === 403) {
    window.location.href = '/error/권한이 없습니다';
  }

  if (!response.ok) {
    const error = new TinyError(
      `Network response was not ok: ${response.status} ${response.statusText}`,
      response.status
    );
    throw error;
  }
}

export { getErrorMessage, reportError, throwErrorWhenResponseNotOk };
