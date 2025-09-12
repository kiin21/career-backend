import { Injectable } from '@nestjs/common';

import { SessionRepository } from './infrastructure/persistence/session.repository';
import { Session } from './domain/session';
import { User } from '../users/domain/user';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  findById(id: Session['id']): Promise<NullableType<Session>> {
    return this.sessionRepository.findById(id);
  }

  create(data: Omit<Session, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<Session> {
    return this.sessionRepository.create(data);
  }

  update(
    id: Session['id'],
    payload: Partial<Omit<Session, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>>,
  ): Promise<Session | null> {
    return this.sessionRepository.update(id, payload);
  }

  deleteById(id: Session['id']): Promise<void> {
    return this.sessionRepository.deleteById(id);
  }

  deleteByuser_id(conditions: { user_id: User['id'] }): Promise<void> {
    return this.sessionRepository.deleteByuser_id(conditions);
  }

  deleteByuser_idWithExclude(conditions: { user_id: User['id']; excludeSessionId: Session['id'] }): Promise<void> {
    return this.sessionRepository.deleteByuser_idWithExclude(conditions);
  }
}
