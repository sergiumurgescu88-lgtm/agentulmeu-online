import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background effects */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-float-slow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Înapoi la site</span>
        </Link>

        <Card className="glass border-white/10 bg-transparent backdrop-blur-xl">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center animate-pulse-glow">
                <Bot className="w-8 h-8 text-white" />
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Bine ai venit</h1>
                <p className="text-sm text-white/50">
                  Conectează-te pentru a accesa agenții tăi AI
                </p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-0 hover:opacity-90 text-lg py-6 glow-cyan transition-all duration-300"
                size="lg"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => {
                  window.location.href = getOAuthUrl();
                }}
              >
                <Sparkles className={`w-5 h-5 mr-2 transition-transform duration-300 ${hovered ? 'rotate-12 scale-110' : ''}`} />
                Conectare cu Kimi
              </Button>

              <p className="text-xs text-white/30 text-center">
                Prin conectare, ești de acord cu Termenii și Condițiile
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
