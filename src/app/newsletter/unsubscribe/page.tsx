import { Suspense } from "react";
import UnsubscribeClient from "./components/UnsubscribeClient";


const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnsubscribeClient />
    </Suspense>
  )
}

export default page