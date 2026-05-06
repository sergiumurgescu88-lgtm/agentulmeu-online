import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/providers/trpc";
import {
  ArrowLeft,
  Bot,
  Sparkles,
  Cpu,
  Zap,
  Check,
} from "lucide-react";

const models = [
  { id: "gpt-4o-mini", name: "GPT-4o Mini", desc: "Rapid și eficient pentru majoritatea taskurilor", icon: Zap },
  { id: "gpt-4o", name: "GPT-4o", desc: "Performanță maximă pentru taskuri complexe", icon: Cpu },
];

const personalities = [
  { name: "Profesional", desc: "Formal, precis, orientat pe rezultate" },
  { name: "Creativ", desc: "Imaginativ, deschis, brainstorming" },
  { name: "Prietenos", desc: "Relaxat, cald, conversațional" },
  { name: "Tehnic", desc: "Detaliat, analitic, documentat" },
  { name: "Concis", desc: "Scurt și la obiect, fără detalii inutile" },
  { name: "Pedagog", desc: "Răbdător, explicativ, educativ" },
];

export default function CreateAgent() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [selectedPersonality, setSelectedPersonality] = useState("");

  const utils = trpc.useUtils();
  const createMutation = trpc.agent.create.useMutation({
    onSuccess: () => {
      utils.agent.list.invalidate();
      navigate("/dashboard");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({
      name: name.trim(),
      description: description.trim(),
      personality: selectedPersonality.trim(),
      instructions: instructions.trim(),
      model: selectedModel,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Înapoi la Dashboard</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <span className="text-gradient">Creează Agent Nou</span>
          </h1>
          <p className="text-white/50">
            Configurează un agent AI personalizat pentru nevoile tale
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name & Description */}
          <Card className="glass bg-white/5 border-white/10">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Informații de Bază</h2>
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1.5 block">
                  Nume Agent <span className="text-red-400">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Asistent Vânzări, Copywriter AI..."
                  className="glass border-white/10 text-white placeholder:text-white/30 focus:border-cyan-400/50"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1.5 block">Descriere</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="La ce folosește acest agent?"
                  className="glass border-white/10 text-white placeholder:text-white/30 focus:border-cyan-400/50 min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Model Selection */}
          <Card className="glass bg-white/5 border-white/10">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Model AI</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {models.map((model) => {
                  const Icon = model.icon;
                  const isSelected = selectedModel === model.id;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => setSelectedModel(model.id)}
                      className={`relative p-4 rounded-xl border text-left transition-all duration-300 ${
                        isSelected
                          ? "border-cyan-400/50 bg-cyan-400/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <Icon className={`w-6 h-6 mb-3 ${isSelected ? "text-cyan-400" : "text-white/40"}`} />
                      <p className={`font-medium mb-1 ${isSelected ? "text-white" : "text-white/70"}`}>
                        {model.name}
                      </p>
                      <p className="text-xs text-white/40">{model.desc}</p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Personality */}
          <Card className="glass bg-white/5 border-white/10">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <h2 className="text-lg font-semibold text-white">Personalitate</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {personalities.map((p) => {
                  const isSelected = selectedPersonality === p.name;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setSelectedPersonality(p.name)}
                      className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                        isSelected
                          ? "border-pink-400/50 bg-pink-400/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <p className={`text-sm font-medium mb-1 ${isSelected ? "text-white" : "text-white/70"}`}>
                        {p.name}
                      </p>
                      <p className="text-xs text-white/40">{p.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="text-sm text-white/60 mb-1.5 block">Instrucțiuni Personalizate (opțional)</label>
                <Textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Ex: Răspunde întotdeauna în română. Fii concis. Folosește exemple concrete..."
                  className="glass border-white/10 text-white placeholder:text-white/30 focus:border-cyan-400/50 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Personality custom text if none selected */}
          {selectedPersonality && (
            <div className="hidden">
              <input value={selectedPersonality} readOnly />
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={createMutation.isPending || !name.trim()}
              className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-0 hover:opacity-90 px-8 py-6 text-lg glow-cyan"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {createMutation.isPending ? "Se creează..." : "Creează Agentul"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-white/60 hover:text-white"
            >
              Anulează
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
