import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    window.location.href = "/dashboard.html";
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-400/30 border-t-cyan-400 animate-spin mx-auto mb-4" />
        <p className="text-white/60">Se încarcă dashboard-ul...</p>
      </div>
    </div>
  );
}
