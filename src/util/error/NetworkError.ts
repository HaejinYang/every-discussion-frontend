import TinyError from "@/util/error/TinyError";
import router from "@/router";

function throwErrorWhenResponseNotOk(response: Response, ignoreAuth = false) {
    if (!ignoreAuth && response.status === 401) {
        router.push('/error/인증이 필요합니다');
    }

    if (!ignoreAuth && response.status === 403) {
        router.push('/error/권한이 없습니다');
    }

    if (!response.ok) {
        const error = new TinyError(
            `Network response was not ok: ${response.status} ${response.statusText}`,
            response.status
        );
        throw error;
    }
}

export default throwErrorWhenResponseNotOk;