import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Request, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from 'src/auth/dtos/createUser.dto';
import { UsersService } from 'src/users/users.service';
import { signInDto } from './dtos/signIn.dto';
import { Response } from 'express';
import { forgotPasswordDto } from './dtos/forgotPassword.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UsersService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: signInDto, @Res() res: Response) {
        const signInResponse = await this.authService.signIn(signInDto)
        try {
            const successObj = {
                status: HttpStatus.ACCEPTED,
                data: {
                    message: "Logged In Successfully",
                    data: signInResponse
                }
            }
            res.status(HttpStatus.FOUND).send(successObj)
        } catch (error) {
            const errorObj = {
                status: HttpStatus.EXPECTATION_FAILED,
                data:
                {
                    message: "Some Error Occured",
                    data: error
                }
            }
            res.status(HttpStatus.EXPECTATION_FAILED).send(errorObj)
        }
    }

    @Post("register")
    async createUser(@Body() createUserDto: createUserDto, @Res() res: Response) {
        const createUserResponse = this.authService.createUser(createUserDto)
        try {
            const successObj = {
                status: HttpStatus.ACCEPTED,
                data: {
                    message: "User Created Successfully",
                    data: createUserResponse
                }
            }
            res.status(HttpStatus.FOUND).send(successObj)
        } catch (error) {
            const errorObj = {
                status: HttpStatus.EXPECTATION_FAILED,
                data:
                {
                    message: "Some Error Occured",
                    data: error
                }
            }
            res.status(HttpStatus.EXPECTATION_FAILED).send(errorObj)
        }
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: forgotPasswordDto, @Res() res: Response) {
        const forgotPasswordResponse = await this.authService.forgotPassword(forgotPasswordDto)
        try {
            const successObj = {
                status: HttpStatus.ACCEPTED,
                data: {
                    message: "Otp Generated Successfully",
                    data: forgotPasswordResponse
                }
            }
            res.status(HttpStatus.FOUND).send(successObj)
        } catch (error) {
            const errorObj = {
                status: HttpStatus.EXPECTATION_FAILED,
                data:
                {
                    message: "Some Error Occured",
                    data: error
                }
            }
            res.status(HttpStatus.EXPECTATION_FAILED).send(errorObj)
        }
    }

    @Post('reset-password')
    async resetPassword(@Body() email: forgotPasswordDto) {
        const forgotPasswordResponse = this.authService.forgotPassword(email)
        return forgotPasswordResponse
    }
}
