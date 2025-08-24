import { Scrollable } from '@affine/component';
import { ViewSidebarTab } from '@affine/core/modules/workbench';
import { AiIcon, TodayIcon } from '@blocksuite/icons/rc';

import { sidebarScrollArea } from '../detail-page/detail-page.css';
import { EditorJournalPanel } from '../detail-page/tabs/journal';

export const AllDocSidebarTabs = () => {
  return (
    <>
      <ViewSidebarTab tabId="all-docs-journal" icon={<TodayIcon />}>
        <Scrollable.Root className={sidebarScrollArea}>
          <Scrollable.Viewport>
            <EditorJournalPanel />
          </Scrollable.Viewport>
          <Scrollable.Scrollbar />
        </Scrollable.Root>
      </ViewSidebarTab>

      <ViewSidebarTab tabId="all-docs-ai-assistant" icon={<AiIcon />}>
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
    </>
  );
};
