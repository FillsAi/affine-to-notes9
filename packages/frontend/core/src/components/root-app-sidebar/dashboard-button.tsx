import { MenuLinkItem } from '@affine/core/modules/app-sidebar/views';
import { WorkbenchService } from '@affine/core/modules/workbench';
import { DatabaseTableViewIcon } from '@blocksuite/icons/rc';
import { useLiveData, useServices } from '@toeverything/infra';

export const AppSidebarDashboardButton = () => {
  const { workbenchService } = useServices({
    WorkbenchService,
  });
  const workbench = workbenchService.workbench;
  const dashboardActive = useLiveData(
    workbench.location$.selector(location => location.pathname === '/dashboard')
  );

  return (
    <MenuLinkItem
      icon={<DatabaseTableViewIcon />}
      active={dashboardActive}
      to={'/dashboard'}
    >
      <span data-testid="dashboard-pages">Dashboard</span>
    </MenuLinkItem>
  );
};
