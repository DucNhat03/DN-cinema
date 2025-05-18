import { NgModule, Provider } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NZ_TAB_SET } from 'ng-zorro-antd/tabs';

// Export all Zorro modules for use in standalone components
export const zorroModules = [
  NzLayoutModule,
  NzMenuModule,
  NzButtonModule,
  NzIconModule,
  NzInputModule,
  NzDropDownModule,
  NzAvatarModule,
  NzCardModule,
  NzTagModule,
  NzRateModule,
  NzTabsModule,
  NzCommentModule,
  NzEmptyModule,
  NzSpinModule,
  NzFormModule,
  NzCheckboxModule,
  NzMessageModule,
  NzUploadModule
];

// Providers for NG-ZORRO tabs to work in standalone components
export const zorroTabsProviders: Provider[] = [
  { provide: NZ_TAB_SET, useValue: {} }
];

// Keep the NgModule for backward compatibility
@NgModule({
  exports: zorroModules
})
export class ZorroModule { }
