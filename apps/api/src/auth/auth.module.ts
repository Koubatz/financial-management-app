import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

// Converter tempo em formato string para segundos
// Exemplos: '7d' = 604800s, '24h' = 86400s, '3600' = 3600s
const parseExpiresIn = (expiresInStr: string): number => {
  const match = expiresInStr.match(/^(\d+)([smhd])$/);
  if (!match) {
    // Se for apenas número, considerar como segundos
    return parseInt(expiresInStr, 10) || 604800; // 7 dias como padrão
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: { [key: string]: number } = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  return value * (multipliers[unit] || 86400);
};

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const expiresInStr = configService.get<string>('JWT_EXPIRES_IN') || '7d';
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: parseExpiresIn(expiresInStr),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
