import {
  Table,
  TableBody,
  TableBodyRow,
  TableCell,
  TableHead,
  TableHeadRow,
} from '@affine/component';
import {
  DatabaseTableViewIcon,
  FilterIcon,
  SearchIcon,
  WarningIcon,
} from '@blocksuite/icons/rc';
import clsx from 'clsx';

import * as styles from '../enhanced-dashboard.css';

interface Sample {
  id: string;
  name: string;
  type: 'Chemical' | 'Biological' | 'Standard' | 'Buffer';
  location: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  status: 'available' | 'low-stock' | 'expired' | 'depleted';
  lastUsed?: string;
  addedBy: string;
}

const mockSamples: Sample[] = [
  {
    id: '1',
    name: 'DMSO (Dimethyl Sulfoxide)',
    type: 'Chemical',
    location: 'Fridge A-2, Shelf 3',
    quantity: 25,
    unit: 'mL',
    expiryDate: '2024-06-15',
    status: 'available',
    lastUsed: '2024-01-10',
    addedBy: 'Dr. Sarah Chen',
  },
  {
    id: '2',
    name: 'Trypsin-EDTA Solution',
    type: 'Biological',
    location: 'Freezer B-1, Box 4',
    quantity: 2,
    unit: 'mL',
    expiryDate: '2024-02-28',
    status: 'low-stock',
    lastUsed: '2024-01-12',
    addedBy: 'Dr. Michael Torres',
  },
  {
    id: '3',
    name: 'Protein Standard Mix',
    type: 'Standard',
    location: 'Fridge C-3, Drawer 1',
    quantity: 0,
    unit: 'vial',
    expiryDate: '2024-03-10',
    status: 'depleted',
    lastUsed: '2024-01-08',
    addedBy: 'Emily Johnson',
  },
  {
    id: '4',
    name: 'PBS Buffer (10x)',
    type: 'Buffer',
    location: 'RT Storage, Shelf 2',
    quantity: 150,
    unit: 'mL',
    expiryDate: '2023-12-31',
    status: 'expired',
    lastUsed: '2023-12-15',
    addedBy: 'Dr. James Liu',
  },
  {
    id: '5',
    name: 'Cell Culture Media (DMEM)',
    type: 'Biological',
    location: 'Fridge A-1, Door',
    quantity: 85,
    unit: 'mL',
    expiryDate: '2024-04-20',
    status: 'available',
    lastUsed: '2024-01-14',
    addedBy: 'Anna Rodriguez',
  },
  {
    id: '6',
    name: 'Ethanol (70%)',
    type: 'Chemical',
    location: 'Chemical Cabinet A',
    quantity: 5,
    unit: 'mL',
    expiryDate: '2025-01-15',
    status: 'low-stock',
    addedBy: 'Mark Thompson',
  },
];

const getStatusIcon = (status: Sample['status']) => {
  switch (status) {
    case 'available':
      return null;
    case 'low-stock':
      return (
        <WarningIcon
          style={{
            color: 'var(--affine-warning-color)',
            width: '14px',
            height: '14px',
          }}
        />
      );
    case 'expired':
    case 'depleted':
      return (
        <WarningIcon
          style={{
            color: 'var(--affine-error-color)',
            width: '14px',
            height: '14px',
          }}
        />
      );
  }
};

const getStatusBadge = (status: Sample['status']) => {
  const badgeClass = {
    available: styles.badgeVariants.success,
    'low-stock': styles.badgeVariants.warning,
    expired: styles.badgeVariants.error,
    depleted: styles.badgeVariants.error,
  }[status];

  return (
    <span
      className={clsx(styles.badge, badgeClass)}
      style={{ fontSize: '10px', padding: '2px 6px' }}
    >
      {status.replace('-', ' ')}
    </span>
  );
};

const getTypeBadge = (type: Sample['type']) => {
  const colors = {
    Chemical: 'var(--affine-tag-blue)',
    Biological: 'var(--affine-tag-green)',
    Standard: 'var(--affine-tag-purple)',
    Buffer: 'var(--affine-tag-gray)',
  };

  return (
    <span
      className={clsx(styles.badge, styles.badgeVariants.neutral)}
      style={{
        fontSize: '10px',
        padding: '2px 6px',
        backgroundColor: colors[type] + '20',
        color: colors[type] || 'var(--affine-text-secondary-color)',
      }}
    >
      {type}
    </span>
  );
};

const isExpiringSoon = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30 && diffDays > 0;
};

export const SampleInventoryWidget = () => {
  const alertSamples = mockSamples.filter(
    sample =>
      sample.status === 'low-stock' ||
      sample.status === 'expired' ||
      sample.status === 'depleted' ||
      isExpiringSoon(sample.expiryDate)
  );

  return (
    <div className={clsx(styles.widget, styles.widgetSizes.large)}>
      <div className={styles.widgetHeader}>
        <h3 className={styles.widgetTitle}>
          <DatabaseTableViewIcon className={styles.widgetIcon} />
          Sample Inventory
        </h3>
        <div
          className={styles.widgetActions}
          style={{ display: 'flex', gap: '8px' }}
        >
          <button
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => console.log('Search samples')}
          >
            <SearchIcon style={{ width: '16px', height: '16px' }} />
          </button>
          <button
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => console.log('Filter samples')}
          >
            <FilterIcon style={{ width: '16px', height: '16px' }} />
          </button>
          <button
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => console.log('View full inventory')}
          >
            View All
          </button>
        </div>
      </div>

      <div className={styles.widgetContent}>
        {/* Alert Summary */}
        {alertSamples.length > 0 && (
          <div
            className={clsx(styles.alert, styles.alertVariants.warning)}
            style={{ marginBottom: '16px' }}
          >
            <WarningIcon style={{ width: '16px', height: '16px' }} />
            <span>
              {alertSamples.length} sample(s) require attention (low stock,
              expired, or expiring soon)
            </span>
          </div>
        )}

        {/* Inventory Table */}
        <div style={{ overflowX: 'auto' }}>
          <Table style={{ fontSize: '12px' }}>
            <TableHead>
              <TableHeadRow>
                <TableCell
                  style={{
                    padding: '8px 12px',
                    fontWeight: '600',
                    fontSize: '11px',
                  }}
                >
                  Sample Name
                </TableCell>
                <TableCell
                  style={{
                    padding: '8px 12px',
                    fontWeight: '600',
                    fontSize: '11px',
                  }}
                >
                  Type
                </TableCell>
                <TableCell
                  style={{
                    padding: '8px 12px',
                    fontWeight: '600',
                    fontSize: '11px',
                  }}
                >
                  Location
                </TableCell>
                <TableCell
                  style={{
                    padding: '8px 12px',
                    fontWeight: '600',
                    fontSize: '11px',
                  }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  style={{
                    padding: '8px 12px',
                    fontWeight: '600',
                    fontSize: '11px',
                  }}
                >
                  Expiry
                </TableCell>
                <TableCell
                  style={{
                    padding: '8px 12px',
                    fontWeight: '600',
                    fontSize: '11px',
                  }}
                >
                  Status
                </TableCell>
              </TableHeadRow>
            </TableHead>
            <TableBody>
              {mockSamples.slice(0, 6).map(sample => (
                <TableBodyRow
                  key={sample.id}
                  style={{
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                  onClick={() => console.log('Open sample details:', sample.id)}
                >
                  <TableCell style={{ padding: '8px 12px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {getStatusIcon(sample.status)}
                      <div>
                        <div style={{ fontWeight: '500', lineHeight: '1.2' }}>
                          {sample.name}
                        </div>
                        <div
                          style={{
                            fontSize: '10px',
                            color: 'var(--affine-text-secondary-color)',
                            marginTop: '2px',
                          }}
                        >
                          Added by {sample.addedBy}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell style={{ padding: '8px 12px' }}>
                    {getTypeBadge(sample.type)}
                  </TableCell>

                  <TableCell style={{ padding: '8px 12px' }}>
                    <div style={{ fontSize: '11px', lineHeight: '1.3' }}>
                      {sample.location}
                    </div>
                  </TableCell>

                  <TableCell style={{ padding: '8px 12px' }}>
                    <div
                      style={{
                        fontWeight:
                          sample.status === 'low-stock' ||
                          sample.status === 'depleted'
                            ? '600'
                            : '400',
                        color:
                          sample.status === 'depleted'
                            ? 'var(--affine-error-color)'
                            : sample.status === 'low-stock'
                              ? 'var(--affine-warning-color)'
                              : 'var(--affine-text-primary-color)',
                      }}
                    >
                      {sample.quantity} {sample.unit}
                    </div>
                  </TableCell>

                  <TableCell style={{ padding: '8px 12px' }}>
                    <div
                      style={{
                        fontSize: '11px',
                        color:
                          sample.status === 'expired' ||
                          isExpiringSoon(sample.expiryDate)
                            ? 'var(--affine-error-color)'
                            : 'var(--affine-text-secondary-color)',
                      }}
                    >
                      {sample.expiryDate}
                      {isExpiringSoon(sample.expiryDate) &&
                        !sample.status.includes('expired') && (
                          <div
                            style={{
                              fontSize: '10px',
                              marginTop: '2px',
                              color: 'var(--affine-warning-color)',
                            }}
                          >
                            Expires soon
                          </div>
                        )}
                    </div>
                  </TableCell>

                  <TableCell style={{ padding: '8px 12px' }}>
                    {getStatusBadge(sample.status)}
                  </TableCell>
                </TableBodyRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Quick Actions */}
        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            gap: '8px',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'var(--affine-text-secondary-color)',
          }}
        >
          <div>
            Showing {Math.min(6, mockSamples.length)} of {mockSamples.length}{' '}
            samples
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              style={{
                color: 'var(--affine-primary-color)',
                textDecoration: 'none',
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                fontSize: '12px',
              }}
              onClick={() => console.log('Add new sample')}
            >
              + Add Sample
            </button>
            <button
              style={{
                color: 'var(--affine-primary-color)',
                textDecoration: 'none',
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                fontSize: '12px',
              }}
              onClick={() => console.log('Export inventory')}
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
