import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { prisma } from "@/lib/db";

describe("API Routes Tests", () => {
  let testUserId: string;
  let testPostId: string;

  beforeAll(async () => {
    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        email: "test@sy-nl.org",
        name: "Test User",
        password: "hashed_password",
        role: "member",
      },
    });
    testUserId = testUser.id;

    // Create a test post
    const testPost = await prisma.post.create({
      data: {
        title: "Test Post",
        slug: "test-post",
        content: "This is a test post",
        category: "أخبار الجالية",
        authorId: testUserId,
      },
    });
    testPostId = testPost.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.comment.deleteMany({ where: { postId: testPostId } });
    await prisma.post.deleteMany({ where: { id: testPostId } });
    await prisma.user.deleteMany({ where: { email: "test@sy-nl.org" } });
  });

  describe("POST /api/news", () => {
    it("should fetch posts without errors", async () => {
      const posts = await prisma.post.findMany({
        where: { published: true },
        take: 10,
      });
      expect(Array.isArray(posts)).toBe(true);
    });

    it("should filter posts by category", async () => {
      const posts = await prisma.post.findMany({
        where: {
          category: "أخبار الجالية",
          published: true,
        },
      });
      expect(posts.every((p) => p.category === "أخبار الجالية")).toBe(true);
    });

    it("should increment post views", async () => {
      const before = await prisma.post.findUnique({
        where: { id: testPostId },
        select: { views: true },
      });

      await prisma.post.update({
        where: { id: testPostId },
        data: { views: { increment: 1 } },
      });

      const after = await prisma.post.findUnique({
        where: { id: testPostId },
        select: { views: true },
      });

      expect(after!.views).toBe((before?.views || 0) + 1);
    });
  });

  describe("Comments API", () => {
    it("should create a comment", async () => {
      const comment = await prisma.comment.create({
        data: {
          postId: testPostId,
          author: "Test Author",
          content: "Great post!",
        },
      });
      expect(comment.id).toBeDefined();
      expect(comment.content).toBe("Great post!");

      await prisma.comment.delete({ where: { id: comment.id } });
    });

    it("should fetch comments for a post", async () => {
      const comment = await prisma.comment.create({
        data: {
          postId: testPostId,
          author: "Test Author",
          content: "Test comment",
        },
      });

      const comments = await prisma.comment.findMany({
        where: { postId: testPostId },
      });

      expect(comments.length).toBeGreaterThan(0);
      expect(comments.some((c) => c.id === comment.id)).toBe(true);

      await prisma.comment.delete({ where: { id: comment.id } });
    });
  });

  describe("User Management", () => {
    it("should find user by email", async () => {
      const user = await prisma.user.findUnique({
        where: { email: "test@sy-nl.org" },
      });
      expect(user).toBeDefined();
      expect(user?.email).toBe("test@sy-nl.org");
    });

    it("should update user profile", async () => {
      await prisma.user.update({
        where: { id: testUserId },
        data: { bio: "Updated bio" },
      });

      const user = await prisma.user.findUnique({
        where: { id: testUserId },
      });

      expect(user?.bio).toBe("Updated bio");
    });
  });

  describe("Task Management", () => {
    it("should create a task", async () => {
      const task = await prisma.task.create({
        data: {
          title: "Test Task",
          description: "Test description",
          status: "pending",
          priority: "high",
        },
      });

      expect(task.id).toBeDefined();
      expect(task.status).toBe("pending");

      await prisma.task.delete({ where: { id: task.id } });
    });

    it("should filter tasks by priority", async () => {
      const task1 = await prisma.task.create({
        data: {
          title: "High Priority",
          priority: "high",
        },
      });

      const tasks = await prisma.task.findMany({
        where: { priority: "high" },
      });

      expect(tasks.length).toBeGreaterThan(0);

      await prisma.task.delete({ where: { id: task1.id } });
    });
  });

  describe("Survey System", () => {
    it("should create a survey", async () => {
      const survey = await prisma.survey.create({
        data: {
          title: "Test Survey",
          active: true,
          options: {
            create: [
              { text: "Option 1" },
              { text: "Option 2" },
              { text: "Option 3" },
            ],
          },
        },
        include: { options: true },
      });

      expect(survey.id).toBeDefined();
      expect(survey.options.length).toBe(3);

      await prisma.survey.delete({ where: { id: survey.id } });
    });
  });

  describe("Contact Form", () => {
    it("should save contact message", async () => {
      const contact = await prisma.contact.create({
        data: {
          name: "John Doe",
          email: "john@example.com",
          subject: "Test Subject",
          message: "Test message",
        },
      });

      expect(contact.id).toBeDefined();
      expect(contact.email).toBe("john@example.com");

      await prisma.contact.delete({ where: { id: contact.id } });
    });
  });

  describe("Volunteer Registration", () => {
    it("should register a volunteer", async () => {
      const volunteer = await prisma.volunteer.create({
        data: {
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+31612345678",
          skills: "Programming, Design",
        },
      });

      expect(volunteer.id).toBeDefined();
      expect(volunteer.email).toBe("jane@example.com");

      await prisma.volunteer.delete({ where: { id: volunteer.id } });
    });
  });

  describe("Performance & Index Tests", () => {
    it("should query posts efficiently", async () => {
      const start = Date.now();

      const posts = await prisma.post.findMany({
        where: {
          published: true,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000); // Should be fast (< 1 second)
      expect(Array.isArray(posts)).toBe(true);
    });
  });
});
