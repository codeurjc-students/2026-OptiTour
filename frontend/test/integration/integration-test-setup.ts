import { afterAll, beforeAll, beforeEach } from "vitest";
import { login } from "../../src/service/auth-service";

// @ts-ignore
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let cookieJar: string[] = [];
const originalFetch = globalThis.fetch;

beforeAll(() => {
    globalThis.fetch = async (input, init = {}) => {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        const isAnonymousOnly = url.includes("/auth/login") || (url.includes("/user/") && init.method === "POST");

        const headers = new Headers(init.headers || {});
        if (cookieJar.length > 0 && !headers.has("Cookie") && !isAnonymousOnly) {
            headers.set("Cookie", cookieJar.join("; "));
        }
        const res = await originalFetch(input, { ...init, headers });

        const setCookies = typeof res.headers.getSetCookie === "function"
            ? res.headers.getSetCookie()
            : [res.headers.get("set-cookie")].filter(Boolean) as string[];

        for (const cookieStr of setCookies) {
            const pair = cookieStr.split(";")[0];
            const name = pair.split("=")[0];
            cookieJar = cookieJar.filter(c => !c.startsWith(`${name}=`));
            cookieJar.push(pair);
        }

        return res;
    };
});

afterAll(() => {
    globalThis.fetch = originalFetch;
    cookieJar = [];
});

beforeEach(() => {
    cookieJar = [];
});

export async function loginAs(email: string, password: string) {
    await login({ email, password });
}
