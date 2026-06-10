import { redirect } from "next/navigation";

/** Legacy route — quiz flow now lands on /lung-test/result */
export default function LungTestReportRedirect() {
  redirect("/lung-test/result");
}
