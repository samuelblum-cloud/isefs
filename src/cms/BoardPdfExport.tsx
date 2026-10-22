import { Download } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

export function BoardPdfExport({ records }: { records: Tables<"interest_registrations">[] }) {
  const [prepared, setPrepared] = useState<{
    records: typeof records;
    blob: Blob;
    filename: string;
  } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    setError("");
    if (records.length) {
      void import("./board-pdf")
        .then(({ createBoardPdf }) => createBoardPdf(records))
        .then((result) => {
          if (!cancelled) setPrepared({ ...result, records });
        })
        .catch(() => {
          if (!cancelled)
            setError(
              "The Board PDF could not be prepared. Please reopen Interest registrations to try again.",
            );
        });
    }
    return () => {
      cancelled = true;
    };
  }, [records]);
  const ready = prepared?.records === records ? prepared : null;
  function download() {
    if (!ready) return;
    const url = URL.createObjectURL(ready.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = ready.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  }
  return (
    <div>
      <Button
        type="button"
        variant="outline"
        className="btn-secondary h-12 shadow-none"
        disabled={!ready}
        onClick={download}
      >
        <Download /> Export Board PDF
      </Button>
      <p className="mt-2 text-sm text-muted-foreground" role="status">
        {error ||
          (!records.length ? "No registrations to export." : !ready ? "Preparing Board PDF…" : "")}
      </p>
    </div>
  );
}
