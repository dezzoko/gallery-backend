export class UserEntity {
  private constructor(
    public id: number,
    public name: string,
    public surname: string,
    public email: string,
    public password: string,
    public currentHashedRefreshToken: string,
    public roles: string[],
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
    let roles: string[];
    if (object.roles) roles = object.roles.map((role) => role.roleName);
    return new UserEntity(
      object.id,
      object.name,
      object?.surname,
      object.email,
      object.password,
      object?.currentHashedRefreshToken,
      roles,
    );
  }
}
