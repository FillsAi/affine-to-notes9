import { Scrollable } from '@affine/component';
import { AiIcon, PropertyIcon, TodayIcon } from '@blocksuite/icons/rc';
import clsx from 'clsx';

import {
  ViewBody,
  ViewHeader,
  ViewIcon,
  ViewSidebarTab,
  ViewTitle,
} from '../../../../modules/workbench';
import { sidebarScrollArea } from '../detail-page/detail-page.css';
import { EditorJournalPanel } from '../detail-page/tabs/journal';
import * as styles from './enhanced-dashboard.css';
import { ActiveProjectsWidget } from './widgets/active-projects';
import { EquipmentStatusWidget } from './widgets/equipment-status';
import { LabCalendarWidget } from './widgets/lab-calendar';
import { ProtocolLibraryWidget } from './widgets/protocol-library';
import { QuickNotesWidget } from './widgets/quick-notes';
// Import all widget components
import { RecentExperimentsWidget } from './widgets/recent-experiments';
import { SampleInventoryWidget } from './widgets/sample-inventory';

export const EnhancedDashboard = () => {
  return (
    <>
      <ViewTitle title="ELN Dashboard" />
      <ViewIcon icon="dashboard" />
      <ViewHeader>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            height: '44px',
          }}
        >
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '600',
              margin: 0,
              color: 'var(--affine-text-primary-color)',
            }}
          >
            Electronic Lab Notebook
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '14px',
              color: 'var(--affine-text-secondary-color)',
            }}
          >
            <span>Welcome back, Dr. Sarah Chen</span>
            <div
              style={{
                padding: '6px 12px',
                backgroundColor: 'var(--affine-success-color)',
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
              }}
            >
              Lab Status: Active
            </div>
          </div>
        </div>
      </ViewHeader>

      <ViewBody>
        <div className={styles.dashboardGrid}>
          {/* Row 1: Recent Experiments, Active Projects */}
          <RecentExperimentsWidget />
          <ActiveProjectsWidget />

          {/* Row 2: Equipment Status, Sample Inventory */}
          <EquipmentStatusWidget />
          <SampleInventoryWidget />

          {/* Row 3: Lab Calendar, Quick Notes */}
          <LabCalendarWidget />
          <QuickNotesWidget />

          {/* Row 4: Protocol Library spanning full width */}
          <ProtocolLibraryWidget />

          {/* Lab Safety & Compliance Widget */}
          <div
            className={clsx(styles.widget, styles.widgetSizes.medium)}
            style={{
              background:
                'linear-gradient(135deg, var(--affine-background-primary-color) 0%, var(--affine-hover-color) 100%)',
            }}
          >
            <div className={styles.widgetHeader}>
              <h3 className={styles.widgetTitle}>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                Lab Safety & Compliance
              </h3>
              <div className={styles.widgetActions}>
                <button
                  className="text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => console.log('View safety dashboard')}
                >
                  View All
                </button>
              </div>
            </div>

            <div className={styles.widgetContent}>
              {/* Safety Checklist Status */}
              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--affine-text-primary-color)',
                    marginBottom: '8px',
                  }}
                >
                  Daily Safety Checklist
                </div>
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--affine-success-color)20',
                    borderRadius: '6px',
                    border: '1px solid var(--affine-success-color)',
                  }}
                >
                  <div
                    style={{
                      color: 'var(--affine-success-color)',
                      fontWeight: '500',
                      fontSize: '13px',
                    }}
                  >
                    ✓ All safety checks completed for today
                  </div>
                </div>
              </div>

              {/* Upcoming Training */}
              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--affine-text-primary-color)',
                    marginBottom: '8px',
                  }}
                >
                  Training Requirements
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      padding: '8px',
                      backgroundColor: 'var(--affine-warning-color)20',
                      borderRadius: '4px',
                      border: '1px solid var(--affine-warning-color)',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--affine-warning-color)',
                        fontWeight: '500',
                      }}
                    >
                      Chemical Safety Refresher - Due Feb 15
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      padding: '8px',
                      backgroundColor: 'var(--affine-background-primary-color)',
                      borderRadius: '4px',
                      border: '1px solid var(--affine-border-color)',
                    }}
                  >
                    <span
                      style={{ color: 'var(--affine-text-secondary-color)' }}
                    >
                      Biosafety Level 2 Certification - Completed ✓
                    </span>
                  </div>
                </div>
              </div>

              {/* Chemical Inventory Alerts */}
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--affine-text-primary-color)',
                    marginBottom: '8px',
                  }}
                >
                  Chemical Inventory Alerts
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    padding: '8px',
                    backgroundColor: 'var(--affine-error-color)20',
                    borderRadius: '4px',
                    border: '1px solid var(--affine-error-color)',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--affine-error-color)',
                      fontWeight: '500',
                    }}
                  >
                    2 chemicals expiring within 30 days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Research Metrics Widget */}
          <div className={clsx(styles.widget, styles.widgetSizes.medium)}>
            <div className={styles.widgetHeader}>
              <h3 className={styles.widgetTitle}>
                <span style={{ fontSize: '18px' }}>📊</span>
                Research Metrics
              </h3>
            </div>

            <div className={styles.widgetContent}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                {/* Publications */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: 'var(--affine-primary-color)',
                      marginBottom: '4px',
                    }}
                  >
                    3
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--affine-text-secondary-color)',
                    }}
                  >
                    Publications in Review
                  </div>
                </div>

                {/* Citations */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: 'var(--affine-success-color)',
                      marginBottom: '4px',
                    }}
                  >
                    247
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--affine-text-secondary-color)',
                    }}
                  >
                    Total Citations
                  </div>
                </div>

                {/* Grant Applications */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: 'var(--affine-warning-color)',
                      marginBottom: '4px',
                    }}
                  >
                    2
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--affine-text-secondary-color)',
                    }}
                  >
                    Grant Applications Pending
                  </div>
                </div>

                {/* Research Output */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: 'var(--affine-processing-color)',
                      marginBottom: '4px',
                    }}
                  >
                    15
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--affine-text-secondary-color)',
                    }}
                  >
                    Experiments This Month
                  </div>
                </div>
              </div>

              {/* Progress towards goals */}
              <div style={{ marginTop: '20px' }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--affine-text-primary-color)',
                    marginBottom: '8px',
                  }}
                >
                  2024 Research Goals
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                      fontSize: '12px',
                    }}
                  >
                    <span>Publications Goal</span>
                    <span>6/10</span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: 'var(--affine-border-color)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '60%',
                        height: '100%',
                        backgroundColor: 'var(--affine-primary-color)',
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                      fontSize: '12px',
                    }}
                  >
                    <span>Experiments Goal</span>
                    <span>127/200</span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: 'var(--affine-border-color)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '63.5%',
                        height: '100%',
                        backgroundColor: 'var(--affine-success-color)',
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ViewBody>

      {/* Sidebar Tabs */}
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
              <h3
                style={{
                  marginBottom: '16px',
                  color: 'var(--affine-text-primary-color)',
                }}
              >
                ELN AI Assistant
              </h3>

              <div
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--affine-hover-color)',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  fontSize: '13px',
                }}
              >
                <div style={{ fontWeight: '500', marginBottom: '6px' }}>
                  🔬 Lab Assistant
                </div>
                <div
                  style={{
                    color: 'var(--affine-text-secondary-color)',
                    lineHeight: '1.4',
                  }}
                >
                  Ask me about protocols, analyze experimental data, or get help
                  with research planning.
                </div>
              </div>

              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--affine-text-secondary-color)',
                }}
              >
                <div style={{ fontWeight: '500', marginBottom: '8px' }}>
                  Quick Actions:
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <button
                    style={{
                      textAlign: 'left',
                      padding: '6px 8px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--affine-border-color)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    🧪 Optimize my protein purification protocol
                  </button>
                  <button
                    style={{
                      textAlign: 'left',
                      padding: '6px 8px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--affine-border-color)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    📊 Analyze my experimental data trends
                  </button>
                  <button
                    style={{
                      textAlign: 'left',
                      padding: '6px 8px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--affine-border-color)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    📝 Help write experimental methodology
                  </button>
                </div>
              </div>
            </div>
          </Scrollable.Viewport>
          <Scrollable.Scrollbar />
        </Scrollable.Root>
      </ViewSidebarTab>

      <ViewSidebarTab tabId="dashboard-properties" icon={<PropertyIcon />}>
        <Scrollable.Root className={sidebarScrollArea}>
          <Scrollable.Viewport>
            <div style={{ padding: '16px' }}>
              <h3
                style={{
                  marginBottom: '16px',
                  color: 'var(--affine-text-primary-color)',
                }}
              >
                Dashboard Settings
              </h3>

              <div style={{ fontSize: '13px' }}>
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--affine-hover-color)',
                    borderRadius: '6px',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ fontWeight: '500', marginBottom: '8px' }}>
                    Widget Customization
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--affine-text-secondary-color)',
                      marginBottom: '8px',
                    }}
                  >
                    Drag and drop widgets to rearrange your dashboard layout.
                  </div>
                  <button
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'var(--affine-primary-color)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    Enable Edit Mode
                  </button>
                </div>

                <div
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--affine-hover-color)',
                    borderRadius: '6px',
                  }}
                >
                  <div style={{ fontWeight: '500', marginBottom: '8px' }}>
                    Dashboard Preferences
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      fontSize: '12px',
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <input type="checkbox" defaultChecked />
                      Show recent experiments
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <input type="checkbox" defaultChecked />
                      Display equipment status
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <input type="checkbox" defaultChecked />
                      Auto-refresh data
                    </label>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <input type="checkbox" />
                      Compact widget view
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Scrollable.Viewport>
          <Scrollable.Scrollbar />
        </Scrollable.Root>
      </ViewSidebarTab>
    </>
  );
};

export const Component = () => {
  return <EnhancedDashboard />;
};
