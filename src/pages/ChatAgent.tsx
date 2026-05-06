import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/providers/trpc";
import {
  ArrowLeft,
  Bot,
  Send,
  User,
  Loader2,
  Sparkles,
  Plus,
  Trash2,
  MessageSquare,
} from "lucide-react";

export default function ChatAgent() {
  const { agentId } = useParams<{ agentId: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [activeConversation, setActiveConversation] = useState<number | null>(null);

  const agentIdNum = Number(agentId);

  const { data: agent } = trpc.agent.getById.useQuery(
    { id: agentIdNum },
    { enabled: !isNaN(agentIdNum) }
  );

  const { data: conversations } = trpc.agent.listConversations.useQuery(
    { agentId: agentIdNum },
    { enabled: !isNaN(agentIdNum) }
  );

  const { data: chatMessages } = trpc.agent.listMessages.useQuery(
    { conversationId: activeConversation ?? 0 },
    { enabled: activeConversation !== null && !isNaN(activeConversation) }
  );

  const utils = trpc.useUtils();

  const createConversation = trpc.agent.createConversation.useMutation({
    onSuccess: (data) => {
      utils.agent.listConversations.invalidate({ agentId: agentIdNum });
      setActiveConversation(data.insertId ?? null);
    },
  });

  const deleteConversation = trpc.agent.deleteConversation.useMutation({
    onSuccess: () => {
      utils.agent.listConversations.invalidate({ agentId: agentIdNum });
      setActiveConversation(null);
    },
  });

  const sendMessage = trpc.agent.sendMessage.useMutation({
    onSuccess: () => {
      utils.agent.listMessages.invalidate({ conversationId: activeConversation ?? 0 });
      utils.agent.listConversations.invalidate({ agentId: agentIdNum });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (conversations && conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0].id);
    }
  }, [conversations, activeConversation]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConversation) return;
    sendMessage.mutate({ conversationId: activeConversation, content: input.trim() });
    setInput("");
  };

  const handleNewChat = () => {
    createConversation.mutate({ agentId: agentIdNum });
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar Conversations */}
      <div className="w-72 glass border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-white/10">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/30 to-blue-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white truncate">{agent.name}</p>
              <p className="text-xs text-white/40">{agent.status === "active" ? "● Activ" : "● Inactiv"}</p>
            </div>
          </div>
        </div>

        <div className="p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-white/60 hover:text-white hover:bg-white/10"
            onClick={handleNewChat}
            disabled={createConversation.isPending}
          >
            <Plus className="w-4 h-4" />
            Conversație Nouă
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
          {conversations?.map((conv) => (
            <div key={conv.id} className="group relative">
              <button
                onClick={() => setActiveConversation(conv.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeConversation === conv.id
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="truncate">{conv.title}</span>
                </div>
              </button>
              <button
                onClick={() => deleteConversation.mutate({ id: conv.id })}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-400/20 text-white/40 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          {(!conversations || conversations.length === 0) && (
            <p className="text-xs text-white/30 text-center py-4">Nicio conversație încă</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 glass">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400/30 to-blue-500/30 flex items-center justify-center md:hidden">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">{agent.name}</h2>
              <p className="text-xs text-white/40">{agent.personality || "Agent AI"}</p>
            </div>
          </div>
          <Link to="/dashboard" className="md:hidden">
            <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6">
          {(!chatMessages || chatMessages.length === 0) && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 flex items-center justify-center mb-4 animate-pulse-glow">
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Începe o conversație</h3>
              <p className="text-sm text-white/40 max-w-sm">
                {agent.name} este gata să te ajute. Scrie un mesaj pentru a începe.
              </p>
            </div>
          )}

          {chatMessages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-purple-400/30 to-pink-500/30"
                    : "bg-gradient-to-br from-cyan-400/30 to-blue-500/30"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4 text-purple-400" />
                ) : (
                  <Bot className="w-4 h-4 text-cyan-400" />
                )}
              </div>
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-white border border-white/10"
                    : "glass text-white/90 border border-white/10"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeConversation ? "Scrie un mesaj..." : "Selectează sau creează o conversație"}
              disabled={!activeConversation || sendMessage.isPending}
              className="glass border-white/10 text-white placeholder:text-white/30 focus:border-cyan-400/50 flex-1"
            />
            <Button
              type="submit"
              disabled={!input.trim() || !activeConversation || sendMessage.isPending}
              className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white border-0 hover:opacity-90 px-4"
            >
              {sendMessage.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
