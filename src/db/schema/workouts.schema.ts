import {
  pgTable,
  uuid,
  integer,
  varchar,
  timestamp,
  pgEnum,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const exerciseEnum = pgEnum('exercise_type', [
  'squat',
  'bench',
  'deadlift',
]);

export const workouts = pgTable('workouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  exercise: exerciseEnum('exercise').notNull(),
  date: timestamp('date').defaultNow().notNull(),
});

export const workoutSets = pgTable('workout_sets', {
  id: uuid('id').defaultRandom().primaryKey(),
  workoutId: uuid('workout_id')
    .references(() => workouts.id)
    .notNull(),
  weight: integer('weight').notNull(),
  reps: integer('reps').notNull(),
  targetRpe: integer('target_rpe').notNull(),
  actualRpe: integer('actual_rpe').notNull(),
});
