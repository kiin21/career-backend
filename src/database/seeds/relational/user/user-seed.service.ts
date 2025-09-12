import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { RoleEnum } from '../../../../roles/roles.enum';
import { StatusEnum } from '../../../../statuses/statuses.enum';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.admin,
        },
      },
    });

    if (!countAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      await this.repository.save(
        this.repository.create({
          firstName: 'Super',
          lastName: 'Admin',
          email: 'admin@example.com',
          password_hash: password,
          role: {
            id: RoleEnum.admin,
            name: 'Admin',
          },
          status: {
            id: StatusEnum.active,
            name: 'Active',
          },
        }),
      );
    }

    // Check if mock data users already exist
    const mockUsers = [
      'alice@example.com',
      'bao@example.com',
      'carla@example.com',
      'david@example.com',
      'emma@example.com',
    ];

    for (const email of mockUsers) {
      const existingUser = await this.repository.findOne({
        where: { email },
      });

      if (!existingUser) {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash('secret', salt);

        let userData;
        switch (email) {
          case 'alice@example.com':
            userData = {
              firstName: 'Alice',
              lastName: 'Nguyen',
              email,
              password_hash: password,
              role: { id: RoleEnum.user, name: 'User' },
              status: { id: StatusEnum.active, name: 'Active' },
            };
            break;
          case 'bao@example.com':
            userData = {
              firstName: 'Bao',
              lastName: 'Tran',
              email,
              password_hash: password,
              role: { id: RoleEnum.user, name: 'User' },
              status: { id: StatusEnum.active, name: 'Active' },
            };
            break;
          case 'carla@example.com':
            userData = {
              firstName: 'Carla',
              lastName: 'Le',
              email,
              password_hash: password,
              role: { id: RoleEnum.user, name: 'User' },
              status: { id: StatusEnum.active, name: 'Active' },
            };
            break;
          case 'david@example.com':
            userData = {
              firstName: 'David',
              lastName: 'Hoang',
              email,
              password_hash: password,
              role: { id: RoleEnum.admin, name: 'Admin' },
              status: { id: StatusEnum.active, name: 'Active' },
            };
            break;
          case 'emma@example.com':
            userData = {
              firstName: 'Emma',
              lastName: 'Pham',
              email,
              password_hash: password,
              role: { id: RoleEnum.admin, name: 'Admin' },
              status: { id: StatusEnum.active, name: 'Active' },
            };
            break;
          default:
            continue;
        }

        await this.repository.save(this.repository.create(userData));
      }
    }

    // Keep the original user if no users exist
    const countUser = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.user,
        },
      },
    });

    if (!countUser) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      await this.repository.save(
        this.repository.create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password_hash: password,
          role: {
            id: RoleEnum.user,
            name: 'User',
          },
          status: {
            id: StatusEnum.active,
            name: 'Active',
          },
        }),
      );
    }
  }
}
