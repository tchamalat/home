import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect legacy /dashboard route to /picture_app
  redirect("/picture_app");
}
