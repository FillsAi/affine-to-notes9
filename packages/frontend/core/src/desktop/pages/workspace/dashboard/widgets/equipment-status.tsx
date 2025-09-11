import {
  DoneIcon,
  PausePanelIcon,
  ProgressIcon,
  SettingsIcon,
  TodayIcon,
  WarningIcon,
} from '@blocksuite/icons/rc';
import clsx from 'clsx';

import * as styles from '../enhanced-dashboard.css';

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'in-use' | 'maintenance' | 'offline';
  location: string;
  currentUser?: string;
  nextMaintenance?: string;
  bookings?: number;
  utilizationRate?: number;
}

const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'LC-MS/MS System',
    type: 'Analytical',
    status: 'in-use',
    location: 'Lab A-201',
    currentUser: 'Dr. Sarah Chen',
    nextMaintenance: '2024-02-15',
    bookings: 3,
    utilizationRate: 85,
  },
  {
    id: '2',
    name: 'Cell Culture Incubator #1',
    type: 'Cell Biology',
    status: 'available',
    location: 'Lab B-105',
    nextMaintenance: '2024-01-25',
    bookings: 1,
    utilizationRate: 60,
  },
  {
    id: '3',
    name: 'X-Ray Crystallographer',
    type: 'Structural',
    status: 'maintenance',
    location: 'Lab C-301',
    nextMaintenance: '2024-01-20',
    bookings: 0,
    utilizationRate: 0,
  },
  {
    id: '4',
    name: 'PCR Thermocycler',
    type: 'Molecular Biology',
    status: 'available',
    location: 'Lab A-203',
    currentUser: undefined,
    nextMaintenance: '2024-03-01',
    bookings: 2,
    utilizationRate: 45,
  },
  {
    id: '5',
    name: 'NMR Spectrometer',
    type: 'Analytical',
    status: 'offline',
    location: 'Lab D-401',
    nextMaintenance: '2024-01-18',
    bookings: 0,
    utilizationRate: 0,
  },
  {
    id: '6',
    name: 'Flow Cytometer',
    type: 'Cell Analysis',
    status: 'in-use',
    location: 'Lab B-107',
    currentUser: 'Dr. Michael Torres',
    nextMaintenance: '2024-02-28',
    bookings: 4,
    utilizationRate: 92,
  },
];

const getStatusIcon = (status: Equipment['status']) => {
  switch (status) {
    case 'available':
      return <DoneIcon style={{ color: 'var(--affine-success-color)' }} />;
    case 'in-use':
      return (
        <ProgressIcon style={{ color: 'var(--affine-processing-color)' }} />
      );
    case 'maintenance':
      return (
        <PausePanelIcon style={{ color: 'var(--affine-warning-color)' }} />
      );
    case 'offline':
      return <WarningIcon style={{ color: 'var(--affine-error-color)' }} />;
  }
};

const getStatusBadge = (status: Equipment['status']) => {
  const badgeClass = {
    available: styles.badgeVariants.success,
    'in-use': styles.badgeVariants.primary,
    maintenance: styles.badgeVariants.warning,
    offline: styles.badgeVariants.error,
  }[status];

  return (
    <span className={clsx(styles.badge, badgeClass)}>
      {status.replace('-', ' ')}
    </span>
  );
};

const getStatusColor = (status: Equipment['status']) => {
  switch (status) {
    case 'available':
      return 'var(--affine-success-color)';
    case 'in-use':
      return 'var(--affine-processing-color)';
    case 'maintenance':
      return 'var(--affine-warning-color)';
    case 'offline':
      return 'var(--affine-error-color)';
  }
};

export const EquipmentStatusWidget = () => {
  const statusCounts = mockEquipment.reduce(
    (acc, equipment) => {
      acc[equipment.status] = (acc[equipment.status] || 0) + 1;
      return acc;
    },
    {} as Record<Equipment['status'], number>
  );

  const _totalEquipment = mockEquipment.length;

  return (
    <div className={clsx(styles.widget, styles.widgetSizes.large)}>
      <div className={styles.widgetHeader}>
        <h3 className={styles.widgetTitle}>
          <SettingsIcon className={styles.widgetIcon} />
          Lab Equipment Status
        </h3>
        <div className={styles.widgetActions}>
          <button
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => console.log('View equipment calendar')}
          >
            Schedule
          </button>
        </div>
      </div>

      <div className={styles.widgetContent}>
        {/* Status Overview */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '12px',
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: 'var(--affine-hover-color)',
            borderRadius: '8px',
          }}
        >
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: getStatusColor(status as Equipment['status']),
                  marginBottom: '4px',
                }}
              >
                {count}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  textTransform: 'capitalize',
                  color: 'var(--affine-text-secondary-color)',
                }}
              >
                {status.replace('-', ' ')}
              </div>
            </div>
          ))}
        </div>

        {/* Equipment List */}
        <div style={{ display: 'grid', gap: '12px' }}>
          {mockEquipment.map(equipment => (
            <div
              key={equipment.id}
              className={styles.listItem}
              style={{
                padding: '12px 16px',
                backgroundColor: 'var(--affine-background-primary-color)',
                border: '1px solid var(--affine-border-color)',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onClick={() => console.log('Open equipment:', equipment.id)}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {getStatusIcon(equipment.status)}
                </div>

                <div style={{ flex: 1 }}>
                  <div className={styles.listItemTitle}>{equipment.name}</div>
                  <div className={styles.listItemMeta}>
                    <span>{equipment.type}</span>
                    <span>{equipment.location}</span>
                    {equipment.currentUser && (
                      <span>Used by: {equipment.currentUser}</span>
                    )}
                    {equipment.bookings !== undefined &&
                      equipment.bookings > 0 && (
                        <span>{equipment.bookings} upcoming bookings</span>
                      )}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '4px',
                  }}
                >
                  {getStatusBadge(equipment.status)}

                  {equipment.utilizationRate !== undefined && (
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--affine-text-secondary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>Usage: {equipment.utilizationRate}%</span>
                    </div>
                  )}

                  {equipment.nextMaintenance && (
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--affine-text-secondary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <TodayIcon style={{ width: '12px', height: '12px' }} />
                      <span>Next: {equipment.nextMaintenance}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Utilization Bar */}
              {equipment.utilizationRate !== undefined &&
                equipment.utilizationRate > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: 'var(--affine-border-color)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${equipment.utilizationRate}%`,
                          height: '100%',
                          backgroundColor:
                            equipment.utilizationRate > 80
                              ? 'var(--affine-error-color)'
                              : equipment.utilizationRate > 60
                                ? 'var(--affine-warning-color)'
                                : 'var(--affine-success-color)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>

        {/* Maintenance Alerts */}
        <div style={{ marginTop: '16px' }}>
          {mockEquipment.some(
            eq => eq.status === 'maintenance' || eq.status === 'offline'
          ) && (
            <div className={clsx(styles.alert, styles.alertVariants.warning)}>
              <WarningIcon style={{ width: '16px', height: '16px' }} />
              <span>
                {
                  mockEquipment.filter(
                    eq => eq.status === 'maintenance' || eq.status === 'offline'
                  ).length
                }{' '}
                equipment(s) require attention
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
