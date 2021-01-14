import { VueStorefrontModule, VueStorefrontModuleConfig } from '@vue-storefront/core/lib/module'
import { afterRegistration } from './hooks/afterRegistration'
import { module } from './store'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { StorefrontModule } from '@vue-storefront/core/lib/modules';

export const KEY = 'smile'

export const SmileModule: StorefrontModule = function ({ store, router, appConfig }) {
  StorageManager.init(KEY)
  afterRegistration(appConfig, store)
  store.registerModule(KEY, module)
}
