import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserTable1650887844424 implements MigrationInterface {
    name = 'AddUserTable1650887844424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION trigger_set_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `)
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "passwordVersion" character varying NOT NULL, "iv" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`
            CREATE TRIGGER set_timestamp
            BEFORE UPDATE ON "user"
            FOR EACH ROW
            EXECUTE PROCEDURE trigger_set_timestamp();
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION trigger_set_timestamp`)
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
