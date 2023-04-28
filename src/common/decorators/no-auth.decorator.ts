import { SetMetadata } from '@nestjs/common';

import { NO_JWT_AUTH } from '../constants/metatags';

export const NoJwtAuth = () => SetMetadata(NO_JWT_AUTH, true);
