import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to dashboard since user is assumed to be authenticated
  redirect("/dashboard")
}
