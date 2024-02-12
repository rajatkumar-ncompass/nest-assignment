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
import { AES } from 'crypto-ts';
import { resetPasswordParams } from './types/resetPasswordParams';


const dummyKey: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
function generateOTP(characters: string): string {
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
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
        if (user?.PASSWORD !== Md5.hashStr(signInDetails.PASSWORD)) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.ID, username: user.PASSWORD };
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
        const encryptedMessage = AES.encrypt(forgotPasswordDetails.EMAIL, 'test').toString();
        const otp = generateOTP(encryptedMessage)
        const forgotPasswordResponse = {
            otp: otp
        }
        await
            this.userRepository
                .createQueryBuilder()
                .update(user)
                .set({ OTP: otp, OTP_EXPIRE: new Date() })
                .where(`EMAIL = :EMAIL`, { EMAIL: forgotPasswordDetails.EMAIL })
                .execute()

        return forgotPasswordResponse
    }

    async resetPassword(resetPasswordDetails: resetPasswordParams) {

        const fetchOtp = await
            this.userRepository
                .createQueryBuilder()
                .select()
                .where(`EMAIL = :EMAIL`, { EMAIL: resetPasswordDetails.EMAIL })
                .getOne();
        const currentDate = new Date()
        const diff = Math.abs(fetchOtp.OTP_EXPIRE.valueOf() - currentDate.valueOf())
        if ((diff / 1000) > 40) {
            throw new UnauthorizedException()
        }
        if (fetchOtp.OTP != resetPasswordDetails.OTP.toString()) {
            throw new UnauthorizedException()
        }
        const hashedPassword = Md5.hashStr(resetPasswordDetails.NEWPASSWORD)
        const updatePasswordResponse = await
            this.userRepository
                .createQueryBuilder()
                .update(user)
                .set({ PASSWORD: hashedPassword })
                .where(`EMAIL = :EMAIL`, { EMAIL: resetPasswordDetails.EMAIL })
                .execute()

        return updatePasswordResponse
    }

}