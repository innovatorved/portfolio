import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    summary: text('summary'),
    content: text('content'), // Markdown content
    publishedAt: integer('published_at', { mode: 'timestamp' }),
    status: text('status').default('Draft'),
    image: text('image'),
    type: text('type').notNull(), // 'blog' or 'project'
    version: integer('version').default(1),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (t) => ({
    uniqueSlugType: unique('unique_slug_type').on(t.slug, t.type),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
