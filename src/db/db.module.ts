import { Module, Global } from '@nestjs/common';
import { db, pgPool } from './drizzle';

@Global()
@Module({
  providers: [
    {
      provide: 'DRIZZLE_DB',
      useValue: db,
    },
    {
      provide: 'PG_POOL',
      useValue: pgPool,
    },
  ],

  exports: ['DRIZZLE_DB', 'PG_POOL'],
})
export class DbModule {}
