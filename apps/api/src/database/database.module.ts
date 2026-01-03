import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { DatabaseService } from './database.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PG_POOL',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');
        const portValue = configService.get<string>('POSTGRES_PORT');
        const parsedPort = Number.parseInt(portValue ?? '', 10);
        const port = Number.isNaN(parsedPort) ? 5432 : parsedPort;
        const pool = new Pool({
          host: configService.get<string>('POSTGRES_HOST', 'localhost'),
          port,
          user: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DB'),
        });

        try {
          logger.log('Pinging database to verify connection...');
          await pool.query('SELECT 1');
          logger.log('Database connection successful.');
          return pool;
        } catch (error) {
          logger.error('Failed to connect to the database.', error);
          // Re-throw the error to prevent the application from starting with a bad db connection.
          throw error;
        }
      },
    },
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
