import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { agents, conversations, messages } from "@db/schema";

export const agentRouter = createRouter({
  // List all agents for the current user
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select().from(agents).where(eq(agents.userId, ctx.user.id)).orderBy(desc(agents.createdAt));
  }),

  // Get a single agent by ID
  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(agents)
        .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.user.id)))
        .limit(1);
      return result[0] ?? null;
    }),

  // Create a new agent
  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        personality: z.string().optional(),
        instructions: z.string().optional(),
        model: z.string().default("gpt-4o-mini"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [agent] = await db.insert(agents).values({
        userId: ctx.user.id,
        name: input.name,
        description: input.description ?? "",
        personality: input.personality ?? "",
        instructions: input.instructions ?? "",
        model: input.model,
        status: "active",
      });
      return agent;
    }),

  // Update an agent
  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        personality: z.string().optional(),
        instructions: z.string().optional(),
        model: z.string().optional(),
        status: z.enum(["active", "paused", "draft"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...updates } = input;
      await db
        .update(agents)
        .set(updates)
        .where(and(eq(agents.id, id), eq(agents.userId, ctx.user.id)));
      const result = await db.select().from(agents).where(eq(agents.id, id)).limit(1);
      return result[0] ?? null;
    }),

  // Delete an agent
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(agents)
        .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.user.id)));
      return { success: true };
    }),

  // Toggle agent status
  toggleStatus: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const agent = await db
        .select()
        .from(agents)
        .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.user.id)))
        .limit(1);
      if (!agent[0]) throw new Error("Agent not found");
      const newStatus = agent[0].status === "active" ? "paused" : "active";
      await db
        .update(agents)
        .set({ status: newStatus })
        .where(eq(agents.id, input.id));
      return { success: true, status: newStatus };
    }),

  // ===== Conversations =====

  // List conversations for an agent
  listConversations: authedQuery
    .input(z.object({ agentId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      return db
        .select()
        .from(conversations)
        .where(and(eq(conversations.agentId, input.agentId), eq(conversations.userId, ctx.user.id)))
        .orderBy(desc(conversations.updatedAt));
    }),

  // Create a new conversation
  createConversation: authedQuery
    .input(z.object({ agentId: z.number(), title: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [conv] = await db.insert(conversations).values({
        agentId: input.agentId,
        userId: ctx.user.id,
        title: input.title ?? "Conversație nouă",
      });
      return conv;
    }),

  // Delete a conversation
  deleteConversation: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(conversations)
        .where(and(eq(conversations.id, input.id), eq(conversations.userId, ctx.user.id)));
      return { success: true };
    }),

  // ===== Messages =====

  // List messages for a conversation
  listMessages: authedQuery
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      // Verify conversation belongs to user
      const conv = await db
        .select()
        .from(conversations)
        .where(and(eq(conversations.id, input.conversationId), eq(conversations.userId, ctx.user.id)))
        .limit(1);
      if (!conv[0]) return [];
      return db
        .select()
        .from(messages)
        .where(eq(messages.conversationId, input.conversationId))
        .orderBy(messages.createdAt);
    }),

  // Send a message and get agent response (simulated for now)
  sendMessage: authedQuery
    .input(z.object({ conversationId: z.number(), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      // Verify conversation belongs to user
      const conv = await db
        .select()
        .from(conversations)
        .where(and(eq(conversations.id, input.conversationId), eq(conversations.userId, ctx.user.id)))
        .limit(1);
      if (!conv[0]) throw new Error("Conversation not found");

      // Insert user message
      const [userMsg] = await db.insert(messages).values({
        conversationId: input.conversationId,
        role: "user",
        content: input.content,
      });

      // Get agent to build response
      const agent = await db.select().from(agents).where(eq(agents.id, conv[0].agentId)).limit(1);
      const agentData = agent[0];

      // Generate simulated agent response
      const responses = [
        `Bună! Sunt ${agentData?.name ?? "agentul tău"}. Am înțeles mesajul tău: "${input.content}". Cum pot să te ajut mai departe?`,
        `Interesant punct de vedere! Ca ${agentData?.personality ?? "asistent AI"}, consider că acest subiect merită explorat mai în detaliu.`,
        `Am procesat informația. ${agentData?.instructions ?? ""} Vrei să lucrăm împreună la asta?`,
        `Răspunsul meu ca ${agentData?.name ?? "agent"}: aceasta este o întrebare excelentă! Iată perspectiva mea...`,
      ];
      const responseText = responses[Math.floor(Math.random() * responses.length)];

      // Insert agent response
      const [agentMsg] = await db.insert(messages).values({
        conversationId: input.conversationId,
        role: "agent",
        content: responseText,
      });

      // Update conversation timestamp
      await db
        .update(conversations)
        .set({ updatedAt: new Date() })
        .where(eq(conversations.id, input.conversationId));

      return { userMessage: userMsg, agentMessage: agentMsg };
    }),
});
