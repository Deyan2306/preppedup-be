import {
  pgTable,
  text,
  varchar,
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
  id: text('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  surname: varchar('surname', { length: 50 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  password: text('password').notNull(),
  nationality: varchar('nationality', { length: 50 }),
  squat: integer('squat').notNull().default(0),
  bench: integer('bench').notNull().default(0),
  deadlift: integer('deadlift').notNull().default(0),
  membership_plan: membershipPlanEnum('membership_plan')
    .notNull()
    .default('basic'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});
