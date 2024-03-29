import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt/dist';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from '../email/email.module';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { JwtStategy } from './jwt.strategy';
import { UserSchema } from './models/user.model';
import { UserRepository } from './repositories/user.repository';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema
            }
        ]),
        PassportModule.register({
            defaultStrategy: 'jwt'
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('SECRETKEY'),
                signOptions: {
                    expiresIn: configService.get('EXPIRESIN')
                }
            }),
            inject: [ConfigService]
        }),
        EmailModule
    ],
    controllers: [AuthController, UserController],
    providers: [UserRepository, UserService, AuthService, JwtStategy],
    exports: [UserService]
})
export class UserModule {}
