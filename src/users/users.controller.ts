import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { createUserDto } from '../auth/dtos/createUser.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService, private authService: AuthService) { }

    @Get(":id")
    async getAuthorById(@Param('email') email: string, @Res() res: Response) {
        try {
            const response = await this.userService.findAuthorByEmail(email);
            const successObj = {
                status: HttpStatus.FOUND,
                data: {
                    message: "Data Fetched Successfully",
                    data: response
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

    @UseGuards(AuthGuard)
    @Post(":id/delete")
    async deleteUser(@Param('id') id: number, @Res() res: Response) {
        try {
            const deleteAuthorResponse = await this.userService.deleteAuthor(id);
            const successObj = {
                status: HttpStatus.ACCEPTED,
                data: {
                    message: "User Deleted Successfully",
                    data: deleteAuthorResponse
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

}
