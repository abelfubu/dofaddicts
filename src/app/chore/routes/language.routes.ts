import { Route } from '@angular/router';
import { harvestPath } from '@chore/routes/paths/harvest.path';
import { profilePath } from '@chore/routes/paths/profile.path';
import { sharePath } from '@chore/routes/paths/share.path';
import { exchangePath } from './paths/exchange.path';

export function configureRoutes(): Route[] {
  return [
    {
      path: '',
      children: [harvestPath, sharePath, profilePath, exchangePath],
    },
  ];
}
