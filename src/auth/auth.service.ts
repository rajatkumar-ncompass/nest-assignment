import { Body, Injectable, Post, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { createUserParams } from 'src/auth/types/createUserParams';
import { Md5 } from 'ts-md5';
import { Repository } from 'typeorm';
import { user } from 'src/typeorm/entities/user';
import { InjectRepository } from '@nestjs/typeorm';
import { forgotPasswordParams } from './types/forgotPasswordParams';
import { signInParams } from './types/signInParamas';


function generateOTP(length: number): string {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return OTP;
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    @InjectRepository(user) private userRepository: Repository<user>

    async signIn(
        signInDetails: signInParams
    ): Promise<{ access_token: string }> {
        const user = await this.usersService.findAuthorByEmail(signInDetails.EMAIL);
        if (user?.user_PASSWORD !== Md5.hashStr(signInDetails.PASSWORD)) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.userId, username: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }



    async createUser(userDetails: createUserParams) {
        const encryptedPassword = Md5.hashStr(userDetails["PASSWORD"])
        userDetails["PASSWORD"] = encryptedPassword
        const createNewUserResponse = await
            this.userRepository
                .createQueryBuilder()
                .insert()
                .into(user)
                .values(userDetails)
                .execute()
        return createNewUserResponse;
    }

    async forgotPassword(forgotPasswordDetails: forgotPasswordParams) {
        const user = await this.usersService.findAuthorByEmail(forgotPasswordDetails.EMAIL);
        if (!user) {
            throw new UnauthorizedException();
        }
        const otp = generateOTP(6)
        const forgotPasswordResponse = {
            otp: otp
        }
        return forgotPasswordResponse
    }

}
