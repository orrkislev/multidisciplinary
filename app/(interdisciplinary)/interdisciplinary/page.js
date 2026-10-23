import { Suspense } from "react";
import Fusion from "../components/Fusion";

export const metadata = {
    title: "Interdisciplinary - Serendipity Engine",
    description: "Pick two subjects and read the encyclopedia entry for the discipline that would exist between them.",
}

export default function InterdisciplinaryPage() {
    return (
        <Suspense>
            <Fusion />
        </Suspense>
    );
}
