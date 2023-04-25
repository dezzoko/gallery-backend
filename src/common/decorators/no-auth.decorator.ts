import { SetMetadata } from '@nestjs/common';

import { NO_AUTH } from '../constants/metatags';

export const NoJwtAuth = () => SetMetadata(NO_AUTH, true);
