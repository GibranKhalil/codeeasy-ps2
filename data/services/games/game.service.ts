import { CrudOperations } from '@/data/@types/abtractModels/CrudOperations.model';
import { Interactions } from '@/data/@types/interactions.type';
import type { IPaginatedResult } from '@/data/@types/interfaces/iPaginatedResult.interface';
import type { CreateGameDto } from '@/data/@types/models/games/dto/create-game.dto';
import type { Game } from '@/data/@types/models/games/entities/game.entity';
import type { AxiosResponse } from 'axios';

class GamesService extends CrudOperations<
  Game,
  AxiosResponse<IPaginatedResult<Game>>,
  CreateGameDto
> {
  constructor(endpoint: string) {
    super('Games', endpoint);
  }

  async addInteraction(pid: string, interaction: { type: keyof Interactions }) {
    const url = this.urlBuilder.buildUrl({
      subEndpoint: `/${pid}/interact`,
    });
    return this.executeRequest<void>(
      'patch',
      url,
      {},
      { type: interaction.type },
    );
  }
}
export const gameService = new GamesService('/games');
