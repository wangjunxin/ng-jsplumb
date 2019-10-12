import { platformBrowser }    from '@angular/platform-browser';

// import { AppModuleNgFactory } from '../aot/src/app/app.module.ngfactory';
import { AppModuleNgFactory } from './app/app.module.ngfactory';

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);