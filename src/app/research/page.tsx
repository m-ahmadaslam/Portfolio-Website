import { redirect } from "next/navigation";

// This portfolio has no standalone research paper. The route is kept (rather than
// deleted) and simply redirects to the projects page, where the work lives.
export default function ResearchPage() {
  redirect("/projects");
}
