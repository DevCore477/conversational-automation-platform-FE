export type ProductNavItem = {
  name: string;
  path: string;
};

export type ProductDropdownMap = Record<string, ProductNavItem[]>;

export const PRODUCT_DROPDOWN: ProductDropdownMap = {
  Build: [
    { name: "Call Transfer", path: "/product/call-transfer" },
    { name: "Book Appointments", path: "/product/book-appointment" },
    { name: "Knowledge Base", path: "/product/knowledge-base" },
    { name: "Navigate IVR", path: "/product/navigate-ivr" },
  ],
  Deploy: [
    { name: "Verified Phone Numbers", path: "/product/verified-phone-numbers" },
  ],
  Monitor: [
    { name: "Post Call Analysis", path: "/product/post-call-analysis" },
  ],
};

