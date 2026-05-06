import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/providers/trpc";
import {
  Plus,
  Bot,
  MessageSquare,
  Pencil,
  Trash2,
  Power,
  PowerOff,
  Search,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [agentToDelete, setAgentToDelete] = useState<number | null>(null);
  const [editingAgent, setEditingAgent] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const utils = trpc.useUtils();
  const { data: agents, isLoading } = trpc.agent.list.useQuery();

  const deleteMutation = trpc.agent.delete.useMutation({
    onSuccess: () => {
      utils.agent.list.invalidate();
      setAgentToDelete(null);
    },
  });

  const toggleMutation = trpc.agent.toggleStatus.useMutation({
    onSuccess: () => utils.agent.list.invalidate(),
  });

  const updateMutation = trpc.agent.update.useMutation({
    onSuccess: () => {
      utils.agent.list.invalidate();
      setEditingAgent(null);
    },
  });

  const filteredAgents = agents?.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (agent: NonNullable<typeof agents>[number]) => {
    setEditingAgent(agent.id);
    setEditName(agent.name);
    setEditDescription(agent.description ?? "");
  };

  const handleSaveEdit = () => {
    if (editingAgent === null) return;
    updateMutation.mutate({
      id: editingAgent,
      name: editName,
      description: editDescription,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              <span className="text-gradient">Agenții Mei</span>
            </h1>
            <p className="text-white/50">
              Gestionează agenții AI și conversează cu ei
            </p>
          </div>
          <Link to="/agents/new">
            <Button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-0 hover:opacity-90 glow-cyan">
              <Plus className="w-4 h-4 mr-2" />
              Creează Agent
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Caută agenți..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 glass border-white/10 text-white placeholder:text-white/30 focus:border-cyan-400/50"
          />
        </div>

        {/* Agents Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass bg-white/5 h-48 animate-pulse" />
            ))}
          </div>
        ) : filteredAgents && filteredAgents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <Card
                key={agent.id}
                className="glass bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        agent.status === "active"
                          ? "bg-gradient-to-br from-cyan-400/30 to-blue-500/30"
                          : "bg-gradient-to-br from-white/10 to-white/5"
                      }`}
                    >
                      <Bot
                        className={`w-6 h-6 ${
                          agent.status === "active" ? "text-cyan-400" : "text-white/30"
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10"
                        onClick={() => handleEdit(agent)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-400/10"
                        onClick={() => setAgentToDelete(agent.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-1">{agent.name}</h3>
                  <p className="text-sm text-white/40 line-clamp-2 mb-4">
                    {agent.description || "Fără descriere"}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          agent.status === "active"
                            ? "bg-emerald-400/15 text-emerald-400"
                            : agent.status === "paused"
                            ? "bg-amber-400/15 text-amber-400"
                            : "bg-white/10 text-white/50"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            agent.status === "active"
                              ? "bg-emerald-400 animate-pulse"
                              : agent.status === "paused"
                              ? "bg-amber-400"
                              : "bg-white/50"
                          }`}
                        />
                        {agent.status === "active" ? "Activ" : agent.status === "paused" ? "Pauză" : "Draft"}
                      </span>
                      <span className="text-xs text-white/30">{agent.model}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                        onClick={() => toggleMutation.mutate({ id: agent.id })}
                        title={agent.status === "active" ? "Pauză" : "Activează"}
                      >
                        {agent.status === "active" ? (
                          <PowerOff className="w-4 h-4" />
                        ) : (
                          <Power className="w-4 h-4" />
                        )}
                      </Button>
                      <Link to={`/agents/${agent.id}/chat`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white/40 hover:text-cyan-400 hover:bg-cyan-400/10"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-cyan-400/60" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {search ? "Niciun agent găsit" : "Nu ai încă agenți"}
            </h3>
            <p className="text-white/40 mb-6 max-w-md mx-auto">
              {search
                ? "Încearcă alt termen de căutare"
                : "Creează primul tău agent AI și începe să automatizezi taskurile."}
            </p>
            {!search && (
              <Link to="/agents/new">
                <Button className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-0 hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Creează Primul Agent
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={agentToDelete !== null} onOpenChange={() => setAgentToDelete(null)}>
        <DialogContent className="glass border-white/10 bg-[hsl(220,25%,8%)]">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Ștergi agentul?
            </DialogTitle>
            <DialogDescription className="text-white/50">
              Această acțiune este ireversibilă. Toate conversațiile și mesajele asociate vor fi șterse.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setAgentToDelete(null)} className="text-white/60 hover:text-white">
              Anulează
            </Button>
            <Button
              variant="destructive"
              onClick={() => agentToDelete && deleteMutation.mutate({ id: agentToDelete })}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleteMutation.isPending ? "Se șterge..." : "Șterge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editingAgent !== null} onOpenChange={() => setEditingAgent(null)}>
        <DialogContent className="glass border-white/10 bg-[hsl(220,25%,8%)]">
          <DialogHeader>
            <DialogTitle className="text-white">Editează Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-white/60 mb-1 block">Nume</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="glass border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="text-sm text-white/60 mb-1 block">Descriere</label>
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="glass border-white/10 text-white placeholder:text-white/30"
              />
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setEditingAgent(null)} className="text-white/60 hover:text-white">
              Anulează
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateMutation.isPending || !editName.trim()}
              className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white"
            >
              {updateMutation.isPending ? "Se salvează..." : "Salvează"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
