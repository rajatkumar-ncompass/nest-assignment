import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class user {

    @PrimaryColumn({ unique: true })
    ID: number;

    @Column()
    FIRST_NAME: string;

    @Column()
    LAST_NAME: string;

    @Column()
    EMAIL: string;

    @Column()
    PASSWORD: string

    @Column({ default: 1 })
    IS_ACTIVE: boolean

    @Column()
    OTP: string

    @CreateDateColumn()
    OTP_EXPIRE: Date;
}
