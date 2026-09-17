import React from "react";
import { useNavigate } from "react-router-dom";
import ScoreRing from "../components/ScoreRing";
import { reportUrl } from "../api";
import { useApp } from "../context/AppContext";

export default function Results() {
  const { current } = useApp();
  const navigate = useNavigate();

  if (!current) {
    return (
      <div className="glass rounded-3xl p-10 text-center">
        <h2 className="font-display text-2xl font-bold">No scan yet</h2>
        <p className="mt-2 text-sm text-[#75666a] dark:text-[#bdb2b5]">
          Start a product scan to see the compliance analysis.
        </p>
        <button
          onClick={() => navigate("/scan")}
          className="mt-5 rounded-xl bg-[#7f1d3a] px-5 py-3 font-bold text-white transition hover:-translate-y-0.5"
        >
          Start scan
        </button>
      </div>
    );
  }

  const checks = current.checks || [];
  const ocrText = current.ocr_text || "";
  const score = Number(current.score || 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <div className="text-xs font-bold uppercase tracking-[.2em] text-[#7f1d3a] dark:text-[#ffb547]">
          OCR verified
        </div>
        <h1 className="mt-1 font-display text-3xl font-black">
          Compliance Analysis
        </h1>
        <p className="mt-2 text-sm text-[#75666a] dark:text-[#bdb2b5]">
          AI-assisted label analysis with OCR evidence and configured rules.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[.55fr_1.45fr]">
        <div className="glass rounded-3xl p-8">
          <ScoreRing score={score} />
          <h2 className="mt-5 font-display text-xl font-bold">
            {current.product || "Packaged Commodity"}
          </h2>
          <div className="mt-1 text-xs text-[#75666a] dark:text-[#bdb2b5]">
            {current.status || "Analysis complete"} • {current.issues || 0} issue(s)
          </div>
          <a
            href={reportUrl(current.id)}
            target="_blank"
            rel="noreferrer"
            className="mt-5 block rounded-xl bg-[#7f1d3a] px-4 py-3 text-center text-sm font-bold text-white transition hover:-translate-y-0.5"
          >
            Download PDF Report ↓
          </a>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold">Rule checks</h2>
            <span className="text-xs font-bold text-[#19c37d]">
              {score}% score
            </span>
          </div>

          {checks.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {checks.map((check, index) => {
                const passed = check.status === "passed";
                return (
                  <div
                    key={check.key || index}
                    className="rounded-2xl border border-black/5 p-4 transition hover:-translate-y-1 dark:border-white/10"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold">
                        {check.label || check.field || `Check ${index + 1}`}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                          passed
                            ? "bg-[#19c37d]/10 text-[#19c37d]"
                            : "bg-[#ffb547]/15 text-[#9a6200]"
                        }`}
                      >
                        {passed ? "PASSED" : "WARNING"}
                      </span>
                    </div>
                    {check.rule_number && (
                      <div className="mt-2 text-[11px] text-[#75666a] dark:text-[#bdb2b5]">
                        Rule {check.rule_number}
                      </div>
                    )}
                    {check.evidence && (
                      <div className="mt-2 text-xs text-[#75666a] dark:text-[#bdb2b5]">
                        Evidence: {check.evidence}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-black/5 p-6 text-sm text-[#75666a] dark:bg-white/5 dark:text-[#bdb2b5]">
              No rule checks were returned for this scan.
            </div>
          )}
        </div>
      </div>

      <div className="glass overflow-hidden rounded-3xl">
        <div className="flex flex-col gap-3 border-b border-black/5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[.18em] text-[#9a6200]">
              OCR Text Extraction
            </div>
            <h2 className="mt-1 font-display text-xl font-bold">
              Extracted label text
            </h2>
            <p className="mt-1 text-xs text-[#75666a] dark:text-[#bdb2b5]">
              Text detected directly from the product image using OCR.
            </p>
          </div>
          <span className="w-fit rounded-full bg-[#19c37d]/10 px-3 py-1.5 text-[9px] font-bold text-[#19c37d]">
            {ocrText ? `${ocrText.length} CHARACTERS` : "NO TEXT"}
          </span>
        </div>

        {ocrText.trim() ? (
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap p-5 text-xs leading-5 text-[#3b3033] dark:text-[#e8dfe1]">
            {ocrText}
          </pre>
        ) : (
          <div className="p-8 text-center text-sm text-[#75666a] dark:text-[#bdb2b5]">
            No OCR text was extracted. Try a clearer product label image.
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#ffb547]/25 bg-[#ffb547]/5 p-5 text-sm text-[#5d4d36] dark:text-[#e8dfe1]">
        <strong>METRIQ Note:</strong> This automated assessment is decision-support
        based on OCR and configured compliance rules. Verify product-specific
        requirements and current applicable notifications before making a regulatory
        determination.
      </div>
    </div>
  );
}
