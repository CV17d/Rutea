import { Injectable } from '@nestjs/common';

export interface UserEntity {
  id: string;
  alias: string;
  avatarSeed: string;
  points: number;
  levelTitle: string;
}

@Injectable()
export class UsersService {
  private users: Map<string, UserEntity> = new Map([
    [
      'user-cuy-42',
      {
        id: 'user-cuy-42',
        alias: 'CuyVeloz42',
        avatarSeed: 'cuy42',
        points: 340,
        levelTitle: 'Guía Mayor de Ruta',
      },
    ],
    [
      'user-galeras-19',
      {
        id: 'user-galeras-19',
        alias: 'GalerasRunner19',
        avatarSeed: 'galeras19',
        points: 195,
        levelTitle: 'Vigía del Galeras',
      },
    ],
  ]);

  getUserById(id: string): UserEntity | undefined {
    return this.users.get(id);
  }

  createAnonymousUser(alias: string, seed: string): UserEntity {
    const id = `anon-${Date.now()}`;
    const newUser: UserEntity = {
      id,
      alias,
      avatarSeed: seed,
      points: 0,
      levelTitle: 'Caminante de Pasto',
    };
    this.users.set(id, newUser);
    return newUser;
  }

  addPoints(userId: string, points: number): UserEntity | null {
    const user = this.users.get(userId);
    if (!user) return null;
    user.points += points;
    return user;
  }
}
