import { MenuLinkItem } from '@affine/core/modules/app-sidebar/views';
import { WorkbenchService } from '@affine/core/modules/workbench';
import { ViewLayersIcon } from '@blocksuite/icons/rc';
import { useLiveData, useServices } from '@toeverything/infra';

export const AppSidebarLIMSButton = () => {
  const { workbenchService } = useServices({
    WorkbenchService,
  });
  const workbench = workbenchService.workbench;
  const limsActive = useLiveData(
    workbench.location$.selector(location => location.pathname === '/lims')
  );

  return (
    <MenuLinkItem icon={<ViewLayersIcon />} active={limsActive} to={'/lims'}>
      <span data-testid="lims-pages">LIMS</span>
    </MenuLinkItem>
  );
};
