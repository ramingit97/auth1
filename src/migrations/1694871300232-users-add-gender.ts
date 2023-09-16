import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersAddGender1694871300232 implements MigrationInterface {
    name = 'UsersAddGender1694871300232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "gender" "public"."users_gender_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "gender"`);
    }

}
