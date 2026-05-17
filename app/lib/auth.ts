export const ADMIN_USER = "admin";
export const ADMIN_PASS = "123456";

export function login(username: string, password: string) {
  return username === ADMIN_USER && password === ADMIN_PASS;
}