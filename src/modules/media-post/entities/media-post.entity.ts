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
    if (!object.id || !object.title || (!object.creator && !object.creatorId)) {
      throw new Error('cannot make MediaPostEntity from object');
    }
    let user;
    //
    if (object.creator) user = UserEntity.fromObject(object.creator);
    object.contentUrl = `http://localhost:${process.env.PORT}/minio/media/${object.contentUrl}`;
    return new MediaPostEntity(
      object.id,
      object.title,
      object.description || null,
      user || null,
      object.contentUrl,
      object.isBlocked,
    );
  }
}
