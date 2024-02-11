import { Injectable } from '@nestjs/common';
import { createUserParams } from '../auth/types/createUserParams';
import { InjectRepository } from '@nestjs/typeorm';
import { user } from 'src/typeorm/entities/user';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
    constructor(@InjectRepository(user) private userRepository: Repository<user>) { }

    async findAuthorByEmail(email: string) {
        const response = await
            this.userRepository
                .createQueryBuilder()
                .select()
                .where(`EMAIL = :EMAIL`, { EMAIL: email })
                .getRawOne();
        return response;
    }

    async deleteAuthor(id: number) {
        const deleteUserResponse = await
            this.userRepository
                .createQueryBuilder()
                .update(user)
                .set({ IS_ACTIVE: false })
                .where(`ID = :ID`, { ID: id })
                .execute()
        return deleteUserResponse;
    }

}
