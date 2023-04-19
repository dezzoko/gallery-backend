export class UserEntity {
  private constructor(
    public id: number,
    public name: string,
    public surname: string,
    public email: string,
    public password: string,
    public currentHashedRefreshToken: string,
  ) {}

  static fromObject(object: any) {
    if (
      (!object.id && !object._id) ||
      !object.name ||
      !object.email ||
      !object.password
    ) {
      throw new Error('cannot create UserEntity from object');
    }

    return new UserEntity(
      object.id,
      object.name,
      object?.surname,
      object.email,
      object.password,
      object?.currentHashedRefreshToken,
    );
  }
}
