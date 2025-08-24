import { Scrollable } from '@affine/component';
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
import * as styles from './lims.css';

export const LIMS = () => {
  return (
    <>
      <ViewTitle title="LIMS" />
      <ViewIcon icon="lims" />
      <ViewHeader>
        <div className={styles.header}>
          <h1>LIMS - Laboratory Inventory Management System</h1>
        </div>
      </ViewHeader>
      <ViewBody>
        <div className={styles.body}>
          <div className={styles.content}>
            <h2>Welcome to LIMS</h2>
            <p>
              Laboratory Inventory Management System for tracking and managing
              laboratory equipment, samples, and resources.
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <h3 className={styles.featureTitle}>Inventory Tracking</h3>
                <p className={styles.featureDescription}>
                  Track laboratory equipment, reagents, and samples in
                  real-time.
                </p>
              </div>
              <div className={styles.feature}>
                <h3 className={styles.featureTitle}>Sample Management</h3>
                <p className={styles.featureDescription}>
                  Manage sample lifecycle from collection to disposal.
                </p>
              </div>
              <div className={styles.feature}>
                <h3 className={styles.featureTitle}>Equipment Maintenance</h3>
                <p className={styles.featureDescription}>
                  Schedule and track equipment maintenance and calibration.
                </p>
              </div>
              <div className={styles.feature}>
                <h3 className={styles.featureTitle}>Quality Control</h3>
                <p className={styles.featureDescription}>
                  Monitor quality control measures and compliance requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ViewBody>

      <ViewSidebarTab tabId="lims-journal" icon={<TodayIcon />}>
        <Scrollable.Root className={sidebarScrollArea}>
          <Scrollable.Viewport>
            <EditorJournalPanel />
          </Scrollable.Viewport>
          <Scrollable.Scrollbar />
        </Scrollable.Root>
      </ViewSidebarTab>

      <ViewSidebarTab tabId="lims-ai-assistant" icon={<AiIcon />}>
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

      <ViewSidebarTab tabId="lims-properties" icon={<PropertyIcon />}>
        <Scrollable.Root className={sidebarScrollArea}>
          <Scrollable.Viewport>
            <div style={{ padding: '16px' }}>
              <h3>LIMS Properties</h3>
              <p>
                Laboratory-specific properties and settings will appear here.
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
  return <LIMS />;
};
