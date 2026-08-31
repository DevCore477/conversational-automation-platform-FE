import Cookies from "js-cookie";
import { type StateStorage } from "zustand/middleware";

/** localStorage + small `company-id` cookie (mirrors other client cookies). */
export const COMPANY_PERSIST_KEY = "company-storage";
const COMPANY_ID_COOKIE = "company-id";

function companyIdFromPersistString(value: string): string | undefined {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") {
      return undefined;
    }
    const state = "state" in parsed ? parsed.state : undefined;
    if (!state || typeof state !== "object") {
      return undefined;
    }
    const company = "company" in state ? state.company : undefined;
    if (!company || typeof company !== "object" || company === null) {
      return undefined;
    }
    const id = "id" in company ? company.id : undefined;
    return typeof id === "string" ? id : undefined;
  } catch {
    return undefined;
  }
}

export const companyPersistStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(name, value);
    const id = companyIdFromPersistString(value);
    if (id) {
      Cookies.set(COMPANY_ID_COOKIE, id, { sameSite: "lax", path: "/" });
    } else {
      Cookies.remove(COMPANY_ID_COOKIE, { path: "/" });
    }
  },
  removeItem: (name) => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.removeItem(name);
    Cookies.remove(COMPANY_ID_COOKIE, { path: "/" });
  },
};
