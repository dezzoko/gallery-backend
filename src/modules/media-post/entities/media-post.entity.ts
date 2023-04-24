import { UserEntity } from 'src/modules/user/entities/user.entity';

export class MediaPostEntity {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public creator: UserEntity | null,
    public contentUrl: string | null,
    public isBlocked: boolean,
  ) {}

  static fromObject(object: any) {
    if (
      !object.id ||
      !object.title ||
      !object.description ||
      (!object.creator && !object.creatorId)
    ) {
      throw new Error('cannot make MediaPostEntity from object');
    }
    let user;

    if (object.creator) user = UserEntity.fromObject(object.creator);

    return new MediaPostEntity(
      object.id,
      object.title,
      object.description,
      user || null,
      object.contentUrl,
      object.isBlocked,
    );
  }
}
