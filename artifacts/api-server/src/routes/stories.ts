import { Router, type IRouter } from "express";
import { desc, eq, sql } from "drizzle-orm";
import {
  CreateStoryBody,
  CreateStoryReplyBody,
  CreateStoryReplyParams,
  CreateStoryReplyResponse,
  CreateStoryResponse,
  GetStoriesOverviewResponse,
  GetStoryParams,
  GetStoryResponse,
  ListStoriesQueryParams,
  ListStoriesResponse,
  ListStoryRepliesParams,
  ListStoryRepliesResponse,
  SupportStoryParams,
  SupportStoryResponse,
} from "@workspace/api-zod";
import { db, storiesTable, storyRepliesTable } from "@workspace/db";

const router: IRouter = Router();

async function findStory(id: string) {
  const [story] = await db
    .select({
      id: storiesTable.id,
      title: storiesTable.title,
      content: storiesTable.content,
      topic: storiesTable.topic,
      createdAt: storiesTable.createdAt,
      supportCount: storiesTable.supportCount,
      replyCount: sql<number>`(
        select count(*)::int from ${storyRepliesTable}
        where ${storyRepliesTable.storyId} = ${storiesTable.id}
      )`,
    })
    .from(storiesTable)
    .where(eq(storiesTable.id, id));

  return story;
}

router.get("/stories", async (req, res): Promise<void> => {
  const query = ListStoriesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const topic = query.data.topic;
  const rows = await db
    .select({
      id: storiesTable.id,
      title: storiesTable.title,
      content: storiesTable.content,
      topic: storiesTable.topic,
      createdAt: storiesTable.createdAt,
      supportCount: storiesTable.supportCount,
      replyCount: sql<number>`(
        select count(*)::int from ${storyRepliesTable}
        where ${storyRepliesTable.storyId} = ${storiesTable.id}
      )`,
    })
    .from(storiesTable)
    .where(topic && topic !== "all" ? eq(storiesTable.topic, topic) : undefined)
    .orderBy(desc(storiesTable.createdAt));

  res.json(
    ListStoriesResponse.parse(
      rows.map((story) => ({
        ...story,
        createdAt: story.createdAt.toISOString(),
      })),
    ),
  );
});

router.post("/stories", async (req, res): Promise<void> => {
  const body = CreateStoryBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [story] = await db.insert(storiesTable).values(body.data).returning();
  res.status(201).json(
    CreateStoryResponse.parse({
      ...story,
      createdAt: story.createdAt.toISOString(),
      replyCount: 0,
    }),
  );
});

router.get("/stories/overview", async (_req, res): Promise<void> => {
  const [storyTotals] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(storiesTable);
  const [replyTotals] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(storyRepliesTable);

  res.json(
    GetStoriesOverviewResponse.parse({
      storyCount: storyTotals?.count ?? 0,
      replyCount: replyTotals?.count ?? 0,
    }),
  );
});

router.get("/stories/:id", async (req, res): Promise<void> => {
  const params = GetStoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const story = await findStory(params.data.id);
  if (!story) {
    res.status(404).json({ error: "Story not found" });
    return;
  }

  res.json(
    GetStoryResponse.parse({
      ...story,
      createdAt: story.createdAt.toISOString(),
    }),
  );
});

router.post("/stories/:id/support", async (req, res): Promise<void> => {
  const params = SupportStoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [updated] = await db
    .update(storiesTable)
    .set({ supportCount: sql`${storiesTable.supportCount} + 1` })
    .where(eq(storiesTable.id, params.data.id))
    .returning({ id: storiesTable.id });
  if (!updated) {
    res.status(404).json({ error: "Story not found" });
    return;
  }

  const story = await findStory(params.data.id);
  res.json(
    SupportStoryResponse.parse({
      ...story,
      createdAt: story?.createdAt.toISOString(),
    }),
  );
});

router.get("/stories/:id/replies", async (req, res): Promise<void> => {
  const params = ListStoryRepliesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const story = await findStory(params.data.id);
  if (!story) {
    res.status(404).json({ error: "Story not found" });
    return;
  }

  const replies = await db
    .select({
      id: storyRepliesTable.id,
      storyId: storyRepliesTable.storyId,
      content: storyRepliesTable.content,
      createdAt: storyRepliesTable.createdAt,
    })
    .from(storyRepliesTable)
    .where(eq(storyRepliesTable.storyId, params.data.id))
    .orderBy(storyRepliesTable.createdAt);

  res.json(
    ListStoryRepliesResponse.parse(
      replies.map((reply) => ({
        ...reply,
        createdAt: reply.createdAt.toISOString(),
      })),
    ),
  );
});

router.post("/stories/:id/replies", async (req, res): Promise<void> => {
  const params = CreateStoryReplyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = CreateStoryReplyBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const story = await findStory(params.data.id);
  if (!story) {
    res.status(404).json({ error: "Story not found" });
    return;
  }

  const [reply] = await db
    .insert(storyRepliesTable)
    .values({ storyId: params.data.id, content: body.data.content })
    .returning();
  res.status(201).json(
    CreateStoryReplyResponse.parse({
      ...reply,
      createdAt: reply.createdAt.toISOString(),
    }),
  );
});

export default router;
