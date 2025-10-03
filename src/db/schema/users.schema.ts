import {
  pgTable,
  varchar,
  uuid,
  integer,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const membershipPlanEnum = pgEnum('membership_plan', [
  'basic',
  'pro',
  'max',
]);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 50 }).notNull(),
  surname: varchar('surname', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  nationality: varchar('nationality', { length: 50 }).notNull(),
  squat: integer('squat').default(0).notNull(),
  bench: integer('bench').default(0).notNull(),
  deadlift: integer('deadlift').default(0).notNull(),
  membershipPlan: membershipPlanEnum('membership_plan')
    .default('basic')
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
