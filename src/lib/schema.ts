
import { pgTable, text, timestamp, integer, unique } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    summary: text('summary'),
    content: text('content'), // Markdown content
    publishedAt: timestamp('published_at', { withTimezone: true }),
    status: text('status').default('Draft'),
    image: text('image'),
    type: text('type').notNull(), // 'blog' or 'project'
    version: integer('version').default(1),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
    uniqueSlugType: unique('unique_slug_type').on(t.slug, t.type),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
