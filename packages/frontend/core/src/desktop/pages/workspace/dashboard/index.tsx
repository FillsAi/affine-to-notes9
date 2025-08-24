import { Scrollable } from '@affine/component';
import { useI18n } from '@affine/i18n';
import { AiIcon, PropertyIcon, TodayIcon } from '@blocksuite/icons/rc';

import {
  ViewBody,
  ViewHeader,
  ViewIcon,
  ViewSidebarTab,
  ViewTitle,
} from '../../../../modules/workbench';
import { sidebarScrollArea } from '../detail-page/detail-page.css';
import { EditorJournalPanel } from '../detail-page/tabs/journal';
import * as styles from './dashboard.css';

export const Dashboard = () => {
  // const t = useI18n(); // Removed unused variable for notes9

  return (
    <>
      <ViewTitle title="Dashboard" />
      <ViewIcon icon="dashboard" />
      <ViewHeader>
        <div className={styles.header}>
          <h1>Dashboard</h1>
        </div>
      </ViewHeader>
      <ViewBody>
        <div className={styles.body}>
          <div className={styles.content}>
            <h2>Welcome to your Dashboard</h2>
            <p>This is a simple static dashboard section.</p>
          </div>
        </div>
      </ViewBody>

      <ViewSidebarTab tabId="dashboard-journal" icon={<TodayIcon />}>
        <Scrollable.Root className={sidebarScrollArea}>
          <Scrollable.Viewport>
            <EditorJournalPanel />
          </Scrollable.Viewport>
          <Scrollable.Scrollbar />
        </Scrollable.Root>
      </ViewSidebarTab>

      <ViewSidebarTab tabId="dashboard-ai-assistant" icon={<AiIcon />}>
        <Scrollable.Root className={sidebarScrollArea}>
          <Scrollable.Viewport>
            <div style={{ padding: '16px' }}>
              <h3>AI Assistant</h3>
              <p>AI assistant features and interactions will appear here.</p>
            </div>
          </Scrollable.Viewport>
          <Scrollable.Scrollbar />
        </Scrollable.Root>
      </ViewSidebarTab>

      <ViewSidebarTab tabId="dashboard-properties" icon={<PropertyIcon />}>
        <Scrollable.Root className={sidebarScrollArea}>
          <Scrollable.Viewport>
            <div style={{ padding: '16px' }}>
              <h3>Dashboard Properties</h3>
              <p>
                Dashboard-specific properties and settings will appear here.
              </p>
            </div>
          </Scrollable.Viewport>
          <Scrollable.Scrollbar />
        </Scrollable.Root>
      </ViewSidebarTab>
    </>
  );
};

export const Component = () => {
  return <Dashboard />;
};
