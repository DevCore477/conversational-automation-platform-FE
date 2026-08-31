import { Metadata } from "next";
import NewsLetterPage from "./components/NewsLetterPage";

export const metadata: Metadata = {
  title: "News Letter | Hexa AI",
  description:
    "Platform admin — captured connect / user news letter subcriptions",
};

export default function AdminRequestsPage() {
  return <NewsLetterPage />;
}
